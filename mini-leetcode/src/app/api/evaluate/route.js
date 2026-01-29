import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, language } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a coding interview evaluator.

Evaluate the following ${language} code:
- Correctness
- Time Complexity
- Space Complexity
- Code Quality
- Score out of 10

Code:
${code}
              `,
            },
          ],
        },
      ],
    });

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from AI";

    return NextResponse.json({ evaluation: text });
  } catch (error) {
    console.error("REAL GEMINI ERROR:", error);
    return NextResponse.json(
      { evaluation: error.message },
      { status: 500 }
    );
  }
}
