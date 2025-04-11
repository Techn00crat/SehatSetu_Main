import streamlit as st
import os
from dotenv import load_dotenv
from langchain_community.llms import Ollama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from datetime import datetime
import json
import re  # For extracting conditions from the AI response
import requests

# Import doctors database
from doctors_data import find_doctors_for_conditions

# Load environment variables
load_dotenv()

# Backend URL and user ID (to be dynamic later)
BACKEND_URL = "http://localhost:5000"
USER_ID = "user_123"

# Langsmith Tracking
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "Medical Symptom Chatbot With Ollama"

# Initialize session state for chat history and assessment
if "messages" not in st.session_state:
    st.session_state.messages = [
        SystemMessage(content="""You are a highly knowledgeable and responsible AI medical assistant. Your task is to help users identify possible diseases based on the symptoms they describe.

        Instructions:

        1. Ask clear follow-up questions if needed.
        2. Predict the most likely diseases based on the symptoms.
        3. Provide concise reasoning for each condition you suggest.
        4. Be accurate, factual, and avoid guessing or inventing conditions.
        5. Always include this line at the end: "This is not a diagnosis. Please consult a doctor for medical advice."
        6. Only suggest well-known medical conditions based on symptoms provided.
        7. Also ask cross questions for clarification if needed.
        8. Also suggest some general medicines which are present which will not cause and side effects and also provide precautions and general tips.
        9. Also suggest doctors from the dataset based on the symptoms provided.
        10. Be polite and professional in your responses.""")
    ]

if "enough_info" not in st.session_state:
    st.session_state.enough_info = False
    
if "final_assessment" not in st.session_state:
    st.session_state.final_assessment = None

if "recommended_doctors" not in st.session_state:
    st.session_state.recommended_doctors = {}

# Title of the app
st.title("Medical Symptom Analyzer")
st.subheader("Describe your symptoms to get potential conditions")

# Sidebar configuration
with st.sidebar:
    st.header("Model Settings")
    llm_model = st.selectbox("Select Open Source model", ["llama3.2"], index=0)
    temperature = st.slider("Temperature", min_value=0.0, max_value=1.0, value=0.7, 
                           help="Higher values make output more creative, lower values more deterministic")
    max_tokens = st.slider("Max Tokens", min_value=50, max_value=500, value=200,
                          help="Maximum length of the response")
    
    # Add a button to clear chat history
    if st.button("Clear Conversation"):
        st.session_state.messages = [st.session_state.messages[0]]  # Keep only the system message
        st.session_state.enough_info = False
        st.session_state.final_assessment = None
        st.session_state.recommended_doctors = {}
        st.rerun()


def generate_response(messages, llm_model, temperature, max_tokens, is_assessment=False):
    # Initialize Ollama LLM
    llm = Ollama(model=llm_model, temperature=temperature)
    
    # Create the proper model parameters depending on what Ollama expects
    model_kwargs = {"num_predict": max_tokens}  # Ollama uses num_predict instead of max_tokens
    
    # Convert messages to format LangChain can use
    langchain_messages = []
    for msg in messages:
        if isinstance(msg, SystemMessage):
            langchain_messages.append(("system", msg.content))
        elif isinstance(msg, HumanMessage):
            langchain_messages.append(("user", msg.content))
        elif isinstance(msg, AIMessage):
            langchain_messages.append(("assistant", msg.content))
    
    # If this is a request for final assessment, add special instruction
    if is_assessment:
        assessment_instruction = """
        Based on the conversation so far, provide a structured final assessment with the following sections:
        
        1. SYMPTOM SUMMARY: Summarize all the symptoms mentioned by the user
        2. POTENTIAL CONDITIONS: List the most likely conditions in order of probability (most likely first)
        3. SEVERITY ASSESSMENT: Rate the overall urgency (Low, Medium, High)
        4. KEY RECOMMENDATIONS: Provide specific next steps the patient should take
        5. GENERAL MEDICATIONS: Suggest some over-the-counter medications that might help alleviate symptoms
        6. PRECAUTIONS & TIPS: Provide lifestyle advice and precautions
        
        Format each section with clear headings and concise content. End with the standard medical disclaimer.
        """
        langchain_messages.append(("user", assessment_instruction))
    
    prompt = ChatPromptTemplate.from_messages(langchain_messages)
    
    # Pass the model_kwargs to the generate method
    chain = prompt | llm.bind(model_kwargs=model_kwargs) | StrOutputParser()
    response = chain.invoke({})
    return response

# Function to extract conditions from assessment
def extract_conditions_from_assessment(assessment_text):
    conditions = []
    
    # Look for the POTENTIAL CONDITIONS section in the assessment
    potential_conditions_section = re.search(r'POTENTIAL CONDITIONS:?(.*?)(?:SEVERITY ASSESSMENT|$)', assessment_text, re.DOTALL | re.IGNORECASE)
    
    if potential_conditions_section:
        section_text = potential_conditions_section.group(1).strip()
        
        # Look for numbered or bulleted items
        condition_items = re.findall(r'(?:\d+\.|\-|\*)\s*([^:]+)(?::|$)', section_text)
        
        if condition_items:
            # Extract just the condition name from each item (before any explanation)
            for item in condition_items:
                condition = item.strip().split('-')[0].split(':')[0].strip()
                conditions.append(condition)
        else:
            # If no clear items found, try to split by newlines or commas
            lines = section_text.split('\n')
            for line in lines:
                if line.strip():
                    parts = line.split(',')
                    for part in parts:
                        if part.strip() and len(part.strip()) > 3:  # Ensure it's not just a number or symbol
                            conditions.append(part.strip())
    
    return conditions

# Backend integration functions
def save_chat_to_backend():
    try:
        messages_to_save = [
            {"role": type(m).__name__, "content": m.content}
            for m in st.session_state.messages
        ]
        
        # Also save the final assessment and recommended doctors if available
        payload = {
            "user_id": USER_ID, 
            "messages": messages_to_save,
            "final_assessment": st.session_state.final_assessment,
            "recommended_doctors": st.session_state.recommended_doctors
        }
        
        response = requests.post(f"{BACKEND_URL}/save_chat", json=payload)
        if response.status_code == 200:
            st.success("Chat saved successfully!")
        else:
            st.error("Failed to save chat.")
    except Exception as e:
        st.error(f"Error: {e}")

def load_chat_from_backend(user_id):
    try:
        response = requests.get(f"{BACKEND_URL}/load_chat/{user_id}")
        if response.status_code == 200:
            data = response.json()
            
            # Load messages
            chat_data = data.get("messages", [])
            new_messages = []
            for msg in chat_data:
                role = msg.get("role")
                content = msg.get("content")
                if role == "SystemMessage":
                    new_messages.append(SystemMessage(content=content))
                elif role == "HumanMessage":
                    new_messages.append(HumanMessage(content=content))
                elif role == "AIMessage":
                    new_messages.append(AIMessage(content=content))
            
            st.session_state.messages = new_messages
            
            # Load final assessment if available
            if "final_assessment" in data:
                st.session_state.final_assessment = data.get("final_assessment")
            
            # Load recommended doctors if available
            if "recommended_doctors" in data:
                st.session_state.recommended_doctors = data.get("recommended_doctors")
            
            # Set enough_info flag if we have messages
            if len(new_messages) > 3:
                st.session_state.enough_info = True
                
            st.rerun()
        else:
            st.warning("Chat not found.")
    except Exception as e:
        st.error(f"Error: {e}")

def list_all_chats():
    try:
        response = requests.get(f"{BACKEND_URL}/list_chats")
        if response.status_code == 200:
            return response.json().get("users", [])
        return []
    except:
        return []

# Display chat history
for message in st.session_state.messages[1:]:  # Skip the system message
    if isinstance(message, HumanMessage):
        with st.chat_message("user"):
            st.write(message.content)
    elif isinstance(message, AIMessage):
        with st.chat_message("assistant"):
            st.write(message.content)
            
            # Check if this message suggests we have enough information
            if not st.session_state.enough_info and len(st.session_state.messages) > 3:
                if "based on your symptoms" in message.content.lower() or "possible conditions" in message.content.lower():
                    st.session_state.enough_info = True

# Complete Assessment button (appears when we have enough information)
if st.session_state.enough_info and not st.session_state.final_assessment:
    if st.button("Complete Assessment & Get Final Recommendations"):
        with st.spinner("Generating comprehensive assessment..."):
            final_assessment = generate_response(
                st.session_state.messages, 
                llm_model, 
                temperature, 
                max(max_tokens * 2, 500),  # Ensure enough tokens for comprehensive assessment
                is_assessment=True
            )
            st.session_state.final_assessment = final_assessment
            
            # Extract conditions and find recommended doctors
            conditions = extract_conditions_from_assessment(final_assessment)
            if conditions:
                st.session_state.recommended_doctors = find_doctors_for_conditions(conditions)

# Display final assessment if available
# Display recommended doctors
if st.session_state.recommended_doctors:
    st.markdown("## Recommended Specialists")
    for specialty, doctors in st.session_state.recommended_doctors.items():
        with st.expander(f"{specialty} Specialists"):
            for doctor in doctors:
                # Create a columns layout for doctor info and booking button
                col1, col2 = st.columns([3, 1])
                
                # Doctor information in the first (wider) column
                with col1:
                    st.markdown(f"**{doctor['name']}** - Rating: {doctor['rating']}/5")
                    st.markdown(f"Specialty: {doctor['specialty']}")
                    st.markdown(f"Address: {doctor['address']}")
                    st.markdown(f"Contact: {doctor['contact']}")
                
                # Booking button in the second column
                with col2:
                    if st.button(f"Book Appointment", key=f"book_{doctor['name']}"):
                        # Store the selected doctor for booking
                        st.session_state.selected_doctor = doctor
                        # Set a flag to show booking form
                        st.session_state.show_booking_form = True
                
                st.markdown("---")
        
        # Option to continue the conversation
        if st.button("Continue Conversation"):
            # Add the assessment to the chat history
            st.session_state.messages.append(
                HumanMessage(content="Please provide a complete assessment of my condition based on our conversation.")
            )
            st.session_state.messages.append(
                AIMessage(content=st.session_state.final_assessment)
            )
            # Reset the final assessment display
            st.session_state.final_assessment = None
            st.rerun()

# Chat input (only show if not viewing final assessment)
if not st.session_state.final_assessment:
    user_input = st.chat_input("Describe your symptoms here...")

    if user_input:
        # Add user message to chat history
        st.session_state.messages.append(HumanMessage(content=user_input))
        
        # Display user message
        with st.chat_message("user"):
            st.write(user_input)
        
        # Show thinking indicator
        with st.chat_message("assistant"):
            thinking_placeholder = st.empty()
            thinking_placeholder.text("Analyzing symptoms...")
            
            # Generate response
            ai_response = generate_response(st.session_state.messages, llm_model, temperature, max_tokens)
            
            # Add AI response to chat history
            st.session_state.messages.append(AIMessage(content=ai_response))
            
            # Display AI response
            thinking_placeholder.write(ai_response)
            
            # Check if we might have enough information now
            if not st.session_state.enough_info and len(st.session_state.messages) > 3:
                if "based on your symptoms" in ai_response.lower() or "possible conditions" in ai_response.lower():
                    st.session_state.enough_info = True
                    st.rerun()  # Refresh to show the Complete Assessment button

# App footer with information
with st.expander("About this Medical Symptom Analyzer"):
    st.markdown("""
    ### How to use this tool:
    1. Describe your symptoms in detail in the chat input
    2. Be specific about duration, severity, and any triggers
    3. Answer follow-up questions from the AI to help narrow down possibilities
    4. When enough information is gathered, you'll see a "Complete Assessment" button
    5. The final assessment will include recommended specialists for your condition
    
    ### Important Disclaimer:
    This tool is for informational purposes only and does not replace professional medical advice.
    Always consult with a qualified healthcare provider for proper diagnosis and treatment.
    """)

# Chat History Management UI
st.header("Chat History")

chat_list = list_all_chats()
selected_chat = st.selectbox("Load previous chat", ["-- Select --"] + chat_list)

if selected_chat and selected_chat != "-- Select --":
    if st.button("Load Chat"):
        load_chat_from_backend(selected_chat)

if st.button("Start New Chat"):
    st.session_state.messages = [st.session_state.messages[0]]  # Keep only the system message
    st.session_state.final_assessment = None
    st.session_state.enough_info = False
    st.session_state.recommended_doctors = {}
    st.rerun()

if st.button("💾 Save This Chat"):
    save_chat_to_backend()