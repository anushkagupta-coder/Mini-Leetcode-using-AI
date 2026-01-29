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
  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(true);

  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");

  useEffect(() => {
    if (!problemId) {
      setProblemLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("id", problemId)
        .single();
      if (cancelled) return;
      if (!error && data) setProblem(data);
      setProblemLoading(false);
    })();
    return () => { cancelled = true; };
  }, [problemId]);

  const evaluateCode = async () => {
    try {
      setLoading(true);
      setEvaluation("");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "javascript",
        }),
      });

      const data = await res.json();

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
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link
            href={problemId ? `/problems/${problemId}` : "/"}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm mb-4 inline-block"
          >
            ← Back to {problemId ? "Problem" : "Home"}
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Code Evaluation</h1>
          {problemId && (
            <p className="mt-1 text-slate-600">Solving Problem ID: {problemId}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Problem description */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-4">
                <h2 className="text-lg font-semibold text-white">Problem Description</h2>
              </div>
              <div className="p-5 max-h-[340px] overflow-y-auto">
                {problemLoading && problemId ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : problem ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${diffClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {problem.tags?.length
                        ? problem.tags.map((t, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                              {t}
                            </span>
                          ))
                        : null}
                    </div>
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {problem.description}
                    </div>
                  </>
                ) : problemId ? (
                  <p className="text-slate-500 text-sm">Could not load problem.</p>
                ) : (
                  <p className="text-slate-500 text-sm">Open a problem and click &quot;Solve & Evaluate&quot; to see the description here.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Code editor + Evaluate + Output */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Code Editor</h2>
                <button
                  type="button"
                  onClick={() => setCode("")}
                  className="text-slate-400 hover:text-white text-xs transition"
                >
                  Clear
                </button>
              </div>
              <textarea
                rows={14}
                className="w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 focus:outline-none resize-none border-0 placeholder-slate-500"
                placeholder="Write your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            <button
              onClick={evaluateCode}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>Evaluate Code</>
              )}
            </button>

            {evaluation && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-800 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-200">AI Evaluation</h2>
                </div>
                <pre className="p-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-80 overflow-y-auto">
                  {evaluation}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
