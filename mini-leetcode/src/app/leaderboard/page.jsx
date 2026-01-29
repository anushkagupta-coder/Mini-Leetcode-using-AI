"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildLeaderboard } from "@/lib/buildLeaderboard";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase.from("leaderboard").select("*");
      setLeaders(buildLeaderboard(data || [], 3));
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">🏆 Leaderboard</h1>
          <p className="mt-1 text-slate-600">Top performers</p>
        </div>

        <div className="space-y-3">
          {leaders.map((user, index) => (
            <div
              key={user.id}
              className="flex justify-between items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-indigo-200/60 transition-all duration-200"
            >
              <span className="font-medium text-slate-900">
                #{index + 1} {user.username}
              </span>
              <span className="font-bold text-lg text-indigo-600">{user.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
