import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function evaluateWithGemini({
  code,
  problemTitle,
  problemDescription,
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a LeetCode-style code evaluator.

Problem:
Title: ${problemTitle}
Description: ${problemDescription}

User Code:
${code}

Evaluate the solution and return:
1. Is the approach correct?
2. Time complexity
3. Space complexity
4. Suggestions to improve
4. Edge cases missed (if any)

Respond in simple bullet points.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
