"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RevisionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;

    async function fetchRevisions() {
      const { data, error } = await supabase
        .from("revisions")
        .select(`
          problem_id,
          problems (
            id,
            title,
            difficulty
          )
        `)
        .eq("user_id", user.id);

      if (!error) {
        setItems(data);
      }
    }

    fetchRevisions();
  }, [user]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-5xl">⭐</span>
            <span>Your Revision List</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Problems you've saved for later practice
          </p>
        </div>

        {items.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg mb-2">
              No problems saved for revision yet.
            </p>
            <p className="text-gray-500 text-sm">
              Start solving problems and mark them for revision to see them here!
            </p>
            <Link
              href="/"
              className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Browse Problems
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => {
            const difficultyColor = getDifficultyColor(item.problems?.difficulty);
            return (
              <Link
                key={item.problem_id}
                href={`/problems/${item.problems.id}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex-1 pr-2">
                      {item.problems?.title}
                    </h2>
                    <span className="text-yellow-500 text-2xl flex-shrink-0">⭐</span>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColor}`}>
                      {item.problems?.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">Click to view →</span>
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
