"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildProblemTrie } from "@/lib/buildTrie";

export default function HomePage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [revisionIds, setRevisionIds] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
}, []);

  // Fetch problems from Supabase
  useEffect(() => {
    async function fetchProblems() {
      const { data, error } = await supabase
        .from("problems")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      setProblems(data || []);
      setResults(data || []);
    }

    fetchProblems();
  }, []);

  //to keep revisioon list
  useEffect(() => {
  async function fetchRevisions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("revisions")
      .select("problem_id")
      .eq("user_id", user.id);

    setRevisionIds(data?.map((r) => r.problem_id) || []);
  }

  fetchRevisions();
}, []);


  // Trie-based search
  useEffect(() => {
    if (search.trim() === "") {
      setResults(problems);
      return;
    }

    const trie = buildProblemTrie(problems);
    setResults(trie.search(search));
  }, [search, problems]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Coding Problems
          </h1>
          <p className="text-gray-600 text-lg">
            Practice coding problems and improve your skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search problems by title..."
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {results.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              No problems found. Try a different search term.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results
            .filter((p) => p?.id)
            .map((p) => {
              const isSaved = mounted && revisionIds.includes(p.id);
              const difficultyColor = getDifficultyColor(p.difficulty);

              return (
                <Link
                  key={p.id}
                  href={`/problems/${p.id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-900 flex-1 pr-2">
                        {p.title}
                      </h2>
                      {isSaved && (
                        <span className="text-yellow-500 text-lg flex-shrink-0" title="Saved for revision">
                          ⭐
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColor}`}>
                        {p.difficulty}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {p.tags?.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {p.tags && p.tags.length > 2 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{p.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}
