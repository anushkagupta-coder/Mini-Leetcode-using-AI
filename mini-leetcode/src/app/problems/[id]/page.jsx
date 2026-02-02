import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import ProblemActions from "./ProblemActions";

function diffClass(d) {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (d === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  if (d === "Hard") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default async function ProblemDetail({ params }) {
  const { id } = params;

  if (!id) {
    return <p className="p-6 text-rose-600">Invalid problem ID</p>;
  }

  // 🔹 Fetch problem
  const { data: problem, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return (
      <p className="p-6 text-rose-600">Error: {error.message}</p>
    );
  }

  // 🔹 Fetch ONLY visible test cases (examples)
  const { data: visibleTestCases } = await supabase
    .from("test_cases")
    .select("input, expected_output")
    .eq("problem_id", id)
    .eq("is_hidden", false)
    .limit(2);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-6 sm:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {problem.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border ${diffClass(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
              {problem.tags?.length
                ? problem.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-sm bg-white/20 text-white border border-white/30"
                    >
                      {tag}
                    </span>
                  ))
                : null}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {problem.description}
              </div>
            </div>

            {/* ✅ Examples (Visible Test Cases) */}
            {visibleTestCases && visibleTestCases.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Examples
                </h3>

                <div className="space-y-4">
                  {visibleTestCases.map((tc, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-medium text-slate-700 mb-2">
                        Example {index + 1}
                      </p>

                      <p className="text-sm font-semibold text-slate-600">
                        Input:
                      </p>
                      <pre className="bg-white border p-3 rounded-md mt-1 overflow-x-auto text-sm">
{tc.input}
                      </pre>

                      <p className="text-sm font-semibold text-slate-600 mt-3">
                        Output:
                      </p>
                      <pre className="bg-white border p-3 rounded-md mt-1 overflow-x-auto text-sm">
{tc.expected_output}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <ProblemActions problem={problem} />

            {/* Solve button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link
                href={`/evaluate?problemId=${problem.id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition"
              >
                Solve & Evaluate →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
