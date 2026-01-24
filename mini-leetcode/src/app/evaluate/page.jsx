"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Common test cases for popular problems
const getDefaultTestCases = (problemTitle) => {
  const title = problemTitle?.toLowerCase() || "";
  
  if (title.includes("two sum")) {
    return [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ];
  }
  
  if (title.includes("best time") || title.includes("stock")) {
    return [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[1, 2]], expected: 1 },
    ];
  }
  
  if (title.includes("duplicate")) {
    return [
      { input: [[1, 2, 3, 1]], expected: true },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    ];
  }
  
  if (title.includes("reverse")) {
    return [
      { input: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"] },
      { input: [["H", "a", "n", "n", "a", "h"]], expected: ["h", "a", "n", "n", "a", "H"] },
    ];
  }
  
  // Default test cases
  return [
    { input: [[1, 2, 3]], expected: [1, 2, 3] },
    { input: [[4, 5, 6]], expected: [4, 5, 6] },
  ];
};

export default function EvaluatePage() {
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const searchParams = useSearchParams();
  const problemId = searchParams.get("problemId");

  useEffect(() => {
    async function fetchProblem() {
      if (!problemId) return;
      
      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("id", problemId)
        .single();

      if (!error && data) {
        setProblem(data);
        const defaultTests = getDefaultTestCases(data.title);
        setTestCases(defaultTests);
        setCode(`// Write your solution here\nfunction solution(nums) {\n    // Your code here\n    return nums;\n}`);
      }
    }
    fetchProblem();
  }, [problemId]);

  async function evaluateCode() {
    if (!code.trim()) {
      setResult({
        success: false,
        error: "Please write some code before evaluating.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, problemId, testCases }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to evaluate code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={problemId ? `/problems/${problemId}` : "/"}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Problem
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Code Editor & Evaluator
          </h1>
          {problem && (
            <p className="text-lg text-gray-600">
              {problem.title} • {problem.difficulty}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Code Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Code Editor
                </h2>
                <button
                  onClick={() => setCode("")}
                  className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  Clear
                </button>
              </div>
              <textarea
                rows={20}
                className="w-full p-6 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none border-0"
                style={{ fontFamily: "'Courier New', monospace" }}
                placeholder="// Write your solution here...&#10;function solution(nums) {&#10;    // Your code here&#10;    return nums;&#10;}"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            <button
              onClick={evaluateCode}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Evaluating...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Run & Evaluate Code
                </>
              )}
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Test Results */}
            {result && result.testResults && result.testResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`px-6 py-4 ${
                  result.allPassed 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                    : "bg-gradient-to-r from-red-500 to-rose-500"
                }`}>
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">
                      {result.allPassed ? "✅" : "❌"}
                    </span>
                    Test Results ({result.passedTests}/{result.totalTests} passed)
                  </h2>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {result.testResults.map((test, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        test.passed
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xl ${test.passed ? "text-green-600" : "text-red-600"}`}>
                          {test.passed ? "✓" : "✗"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          Test Case {test.testCase}
                        </span>
                      </div>
                      <div className="text-sm space-y-1 ml-7">
                        <p>
                          <span className="font-medium">Input:</span>{" "}
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(test.input)}
                          </code>
                        </p>
                        <p>
                          <span className="font-medium">Expected:</span>{" "}
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(test.expected)}
                          </code>
                        </p>
                        {test.output !== null && (
                          <p>
                            <span className="font-medium">Output:</span>{" "}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {JSON.stringify(test.output)}
                            </code>
                          </p>
                        )}
                        {test.error && (
                          <p className="text-red-600">
                            <span className="font-medium">Error:</span> {test.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            {result && result.analysis && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Code Analysis
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Time Complexity</p>
                      <p className="text-xl font-bold text-blue-700">
                        {result.analysis.timeComplexity}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Space Complexity</p>
                      <p className="text-xl font-bold text-purple-700">
                        {result.analysis.spaceComplexity}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Observations:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Loops: {result.analysis.observations.loops}</li>
                      <li>• Hashing: {result.analysis.observations.hashing ? "Yes" : "No"}</li>
                      <li>• Recursion: {result.analysis.observations.recursion ? "Yes" : "No"}</li>
                      <li>• Sorting: {result.analysis.observations.sorting ? "Yes" : "No"}</li>
                    </ul>
                  </div>

                  {result.analysis.suggestions.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-green-700 mb-2">Suggestions:</p>
                      <ul className="text-sm text-green-600 space-y-1">
                        {result.analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.analysis.warnings.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-700 mb-2">Warnings:</p>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        {result.analysis.warnings.map((warning, idx) => (
                          <li key={idx}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {result && result.error && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200">
                <div className="bg-red-500 px-6 py-4">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Error
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-red-600 font-mono text-sm bg-red-50 p-4 rounded">
                    {result.error}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!result && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">👨‍💻</div>
                <p className="text-gray-600 text-lg">
                  Write your code and click "Run & Evaluate" to see results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
