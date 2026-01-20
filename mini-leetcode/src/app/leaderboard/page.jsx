"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildLeaderboard } from "@/lib/buildLeaderboard";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from("leaderboard")
        .select("*");

      setLeaders(buildLeaderboard(data || [], 3));
    }

    fetchLeaderboard();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      {leaders.map((user, index) => (
        <div
  key={user.id}
  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3"
>
  <span className="font-medium">
    #{index + 1} {user.username}
  </span>
  <span className="font-bold text-lg">
    {user.score}
  </span>
</div>

      ))}
    </main>
  );
}
