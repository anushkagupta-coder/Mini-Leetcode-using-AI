"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildProblemTrie } from "@/lib/buildTrie";

function diffClass(d) {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (d === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  if (d === "Hard") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function HomePage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [revisionIds, setRevisionIds] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchProblems() {
      const { data, error } = await supabase.from("problems").select("*");
      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      setProblems(data || []);
      setResults(data || []);
    }
    fetchProblems();
  }, []);

  useEffect(() => {
    async function fetchRevisions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("revisions")
        .select("problem_id")
        .eq("user_id", user.id);
      setRevisionIds(data?.map((r) => r.problem_id) || []);
    }
    fetchRevisions();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setResults(problems);
      return;
    }
    const trie = buildProblemTrie(problems);
    setResults(trie.search(search));
  }, [search, problems]);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Problems
          </h1>
          <p className="mt-2 text-slate-600">
            Practice DSA. Search by title, save for revision.
          </p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-4 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-slate-900 placeholder-slate-400 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            🔍
          </span>
        </div>

        {results.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">No problems found.</p>
          </div>
        )}

        <div className="space-y-4">
          {results
            .filter((p) => p?.id)
            .map((p) => {
              const isSaved = mounted && revisionIds.includes(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/problems/${p.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200/60 transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold text-slate-900 truncate">
                        {p.title}
                      </h2>
                      <p className="mt-1.5 text-slate-600 text-sm line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${diffClass(
                            p.difficulty
                          )}`}
                        >
                          {p.difficulty}
                        </span>
                        {p.tags?.length ? (
                          <span className="text-slate-400 text-xs">
                            {p.tags.join(" · ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {isSaved && (
                      <span className="shrink-0 text-amber-500" title="Saved for revision">
                        ⭐
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
