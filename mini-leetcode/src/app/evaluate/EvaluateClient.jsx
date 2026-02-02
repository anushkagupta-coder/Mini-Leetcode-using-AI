"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

function diffClass(d) {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (d === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  if (d === "Hard") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function EvaluatePage() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");

  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [verdict, setVerdict] = useState("");

  const [loading, setLoading] = useState(false); // AI
  const [submitLoading, setSubmitLoading] = useState(false); // Judge

  const [problem, setProblem] = useState(null);
  const [visibleTestCases, setVisibleTestCases] = useState([]);
  const [problemLoading, setProblemLoading] = useState(true);

  // 🔹 Fetch problem + visible test cases
  useEffect(() => {
    if (!problemId) {
      setProblemLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data: problemData, error } = await supabase
        .from("problems")
        .select("*")
        .eq("id", problemId)
        .single();

      const { data: tcData } = await supabase
        .from("test_cases")
        .select("input, expected_output")
        .eq("problem_id", problemId)
        .eq("is_hidden", false)
        .limit(2);

      if (!cancelled) {
        if (!error && problemData) setProblem(problemData);
        setVisibleTestCases(tcData || []);
        setProblemLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [problemId]);

  // 🧠 AI Evaluate
  const evaluateCode = async () => {
    try {
      setLoading(true);
      setEvaluation("");
      setVerdict("");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "javascript",
        }),
      });

      const data = await res.json();
      setEvaluation(data.evaluation || "No feedback received");
    } catch (err) {
      console.error(err);
      setEvaluation("Error while evaluating code");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Submit to Judge
  const submitCode = async () => {
    if (!code.trim()) {
      alert("Please write some code before submitting");
      return;
    }
    if (!problemId) {
      alert("No problem selected");
      return;
    }

    try {
      setSubmitLoading(true);
      setVerdict("");
      setEvaluation("");

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          code,
        }),
      });

      const data = await res.json();
      setVerdict(data.verdict || "Submission failed");
    } catch (err) {
      console.error(err);
      setVerdict("Error while submitting code");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={problemId ? `/problems/${problemId}` : "/"}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-block"
          >
            ← Back to {problemId ? "Problem" : "Home"}
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Solve & Evaluate
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Problem */}
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Problem Description
              </h2>
            </div>

            <div className="p-5 max-h-[420px] overflow-y-auto">
              {problemLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : problem ? (
                <>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 text-xs rounded border ${diffClass(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    {problem.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-slate-100 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {problem.description}
                  </pre>

                  {/* ✅ Visible Test Cases */}
                  {visibleTestCases.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold text-slate-800 mb-1">
                        Examples
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        These are sample test cases. Additional hidden test cases
                        are used during submission.
                      </p>

                      <div className="space-y-3">
                        {visibleTestCases.map((tc, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                          >
                            <p className="text-xs font-medium text-slate-700 mb-1">
                              Example {index + 1}
                            </p>

                            <p className="text-xs font-semibold text-slate-600">
                              Input:
                            </p>
                            <pre className="bg-white border rounded p-2 text-xs overflow-x-auto">
{tc.input}
                            </pre>

                            <p className="text-xs font-semibold text-slate-600 mt-2">
                              Output:
                            </p>
                            <pre className="bg-white border rounded p-2 text-xs overflow-x-auto">
{tc.expected_output}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">Problem not found</p>
              )}
            </div>
          </div>

          {/* RIGHT: Editor */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-5 py-3 flex justify-between">
                <span className="text-slate-200 text-sm font-semibold">
                  Code Editor (JavaScript)
                </span>
                <button
                  onClick={() => setCode("")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              </div>

              <textarea
                rows={14}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 resize-none outline-none"
                placeholder="Write your JavaScript code here..."
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={evaluateCode}
                disabled={loading}
                className="py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Evaluating..." : "Evaluate (AI)"}
              </button>

              <button
                onClick={submitCode}
                disabled={submitLoading}
                className="py-3 rounded-xl bg-black text-white font-semibold disabled:opacity-50"
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* AI Feedback */}
            {evaluation && (
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-800 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-200">
                    AI Evaluation
                  </h2>
                </div>
                <pre className="p-5 text-sm whitespace-pre-wrap">
                  {evaluation}
                </pre>
              </div>
            )}

            {/* Verdict */}
            {verdict && (
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-200">
                    Submission Result
                  </h2>
                </div>
                <div className="p-5 text-lg font-bold">
                  Verdict:{" "}
                  <span
                    className={
                      verdict === "Accepted"
                        ? "text-emerald-600"
                        : verdict === "Wrong Answer"
                        ? "text-rose-600"
                        : "text-amber-600"
                    }
                  >
                    {verdict}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
