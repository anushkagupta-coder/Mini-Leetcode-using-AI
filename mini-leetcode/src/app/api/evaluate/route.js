import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, language } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ⚠️ This is the MOST stable text model right now
    const model = genAI.getGenerativeModel({
      model: "models/text-bison-001",
    });

    const prompt = `
You are a coding interview evaluator.


Evaluate the following ${language} code:
1. Correctness
2. Time complexity
3. Space complexity
4. Code quality
5. Score out of 10

Code:
${code}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ evaluation: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { evaluation: "AI evaluation failed" },
      { status: 500 }
    );
  }
}
