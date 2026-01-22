"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EvaluatePage() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
const searchParams = useSearchParams();
const problemId = searchParams.get("problemId");

<p className="mb-2 text-gray-600">
  Solving Problem ID: {problemId}
</p>

  async function evaluateCode() {
    setFeedback("Evaluating...");

    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    setFeedback(data.result);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Code Evaluation
      </h1>

      <textarea
        rows={10}
        className="w-full border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-black"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={evaluateCode}
        className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"

      >
        Evaluate Code
      </button>

      {feedback && (
        <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {feedback}
        </pre>
      )}
    </main>
  );
}
