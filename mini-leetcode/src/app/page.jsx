"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildProblemTrie } from "@/lib/buildTrie";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchProblems() {
      const { data } = await supabase
        .from("problems")
        .select("*");

      setProblems(data || []);
      setResults(data || []);
    }

    fetchProblems();
  }, []);

  useEffect(() => {
    if (search === "") {
      setResults(problems);
      return;
    }

    const trie = buildProblemTrie(problems);
    const filtered = trie.search(search);
    setResults(filtered);
  }, [search, problems]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Mini LeetCode
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search problems..."
        className="w-full p-3 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Results */}
      <div className="space-y-4">
        {results.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded"
          >
            <h2 className="text-lg font-semibold">
              {p.title}
            </h2>
            <p className="text-sm text-gray-600">
              {p.difficulty}
            </p>
            <p className="text-sm mt-1">
              {p.tags.join(", ")}
            </p>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500">
            No problems found.
          </p>
        )}
      </div>
    </main>
  );
}