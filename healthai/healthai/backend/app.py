from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)  # Allow requests from Streamlit frontend

CHAT_DIR = "chats"
os.makedirs(CHAT_DIR, exist_ok=True)

@app.route("/save_chat", methods=["POST"])
def save_chat():
    data = request.json
    user_id = data.get("user_id")
    messages = data.get("messages")
    if not user_id or not messages:
        return jsonify({"error": "Invalid data"}), 400
    
    filepath = os.path.join(CHAT_DIR, f"{user_id}.json")
    with open(filepath, "w") as f:
        json.dump(messages, f)
    return jsonify({"message": "Chat saved successfully"}), 200

@app.route("/load_chat/<user_id>", methods=["GET"])
def load_chat(user_id):
    filepath = os.path.join(CHAT_DIR, f"{user_id}.json")
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            messages = json.load(f)
        return jsonify({"messages": messages}), 200
    return jsonify({"error": "Chat not found"}), 404

@app.route("/list_chats", methods=["GET"])
def list_chats():
    files = [f.replace(".json", "") for f in os.listdir(CHAT_DIR)]
    return jsonify({"users": files}), 200

if __name__ == "__main__":
    app.run(port=5000)
