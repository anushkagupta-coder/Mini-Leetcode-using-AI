"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildLeaderboard } from "@/lib/buildLeaderboard";

export default function Home() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from("leaderboard")
        .select("*");

      const top = buildLeaderboard(data || [], 3);
      setLeaders(top);
    }

    fetchLeaderboard();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      {leaders.map((user, index) => (
        <div
          key={user.id}
          className="border p-4 rounded mb-3 flex justify-between"
        >
          <span>
            #{index + 1} {user.username}
          </span>
          <span className="font-semibold">
            {user.score}
          </span>
        </div>
      ))}
    </main>
  );
}
