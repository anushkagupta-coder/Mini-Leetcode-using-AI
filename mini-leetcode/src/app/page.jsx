"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildProblemTrie } from "@/lib/buildTrie";

export default function HomePage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

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

  // Trie-based search
  useEffect(() => {
    if (search.trim() === "") {
      setResults(problems);
      return;
    }

    const trie = buildProblemTrie(problems);
    setResults(trie.search(search));
  }, [search, problems]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Problems
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search problems..."
        className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Problems List */}
      {results.length === 0 && (
        <p className="text-gray-500">
          No problems found.
        </p>
      )}

      <div className="space-y-4">
        {results
  .filter((p) => p?.id) // 👈 ABSOLUTE KEY FIX
  .map((p) => (
    <Link
      key={p.id}
      href={`/problems/${p.id}`}
      className="block border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {p.title}
      </h2>

      <p className="text-gray-600 mt-2 text-sm">
        {p.description}
      </p>

      <div className="mt-3 flex justify-between text-sm">
        <span className="font-medium">
          Difficulty: {p.difficulty}
        </span>
        <span className="text-gray-500">
          {p.tags?.join(", ")}
        </span>
      </div>
    </Link>
))}


      </div>
    </main>
  );
}
