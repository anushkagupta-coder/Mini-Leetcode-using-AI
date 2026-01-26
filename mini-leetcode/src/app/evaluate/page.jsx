"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EvaluatePage() {
  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");

  const evaluateCode = async () => {
    try {
      setLoading(true);
      setEvaluation("");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "javascript", // ✅ hardcoded for now
        }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!data.evaluation) {
        setEvaluation("No feedback received");
        return;
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      console.error(err);
      setEvaluation("Error while evaluating code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Code Evaluation</h1>

      <p className="mb-4 text-gray-600">
        Solving Problem ID: {problemId}
      </p>

      <textarea
        rows={10}
        className="w-full border rounded-lg p-4 font-mono text-sm"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={evaluateCode}
        disabled={loading}
        className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Evaluating..." : "Evaluate Code"}
      </button>

      {evaluation && (
        <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {evaluation}
        </pre>
      )}
    </main>
  );
}
