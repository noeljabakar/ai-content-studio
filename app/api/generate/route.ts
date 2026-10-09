
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { type, tone, topic } = await req.json();

    if (!type || !tone || !topic?.trim()) {
      return NextResponse.json(
        { error: "Please choose a type, a tone, and enter a topic." },
        { status: 400 }
      );
    }

    const prompt = `Write a ${tone} ${type} about: ${topic}.
Return only the finished content, with no extra commentary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    return NextResponse.json({ output: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while generating. Try again." },
      { status: 500 }
    );
  }
}
