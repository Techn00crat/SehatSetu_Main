// app/api/generate/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const { prompt } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ result: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
