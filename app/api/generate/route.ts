
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Please sign in to generate content." },
      { status: 401 }
    );
  }
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

    

let response: Awaited<ReturnType<typeof ai.models.generateContent>> | undefined;


for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    break;
  } catch (error) {
    console.error(`Gemini attempt ${attempt} failed:`, error);

    if (attempt === 3) {
      throw error;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, attempt * 2000)
    );
  }
}


    if (!response) {
  throw new Error("Gemini did not return a response after retries.");
}


const output = response.text ?? "";

const { error: saveError } = await supabase.from("generations").insert({
  user_id: user.id,
  content_type: type,
  tone,
  topic,
  output,
});

if (saveError) {
  console.error("Failed to save generation:", saveError);
}

return NextResponse.json({ output, saved: !saveError });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while generating. Try again." },
      { status: 500 }
    );
  }
}
