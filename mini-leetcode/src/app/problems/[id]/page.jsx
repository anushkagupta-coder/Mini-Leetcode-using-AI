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
  const { id } = await params;

  if (!id) {
    return <p className="p-6 text-rose-600">Invalid problem ID</p>;
  }

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

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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

          <div className="p-6 sm:p-8">
            <div className="prose prose-slate max-w-none">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {problem.description}
              </div>
            </div>

            <ProblemActions problem={problem} />

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
