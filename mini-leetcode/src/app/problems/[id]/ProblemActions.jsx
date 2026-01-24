"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function ProblemActions({ problem }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  async function markForRevision() {
    if (!user) {
      alert("Please login to save for revision");
      return;
    }

    const { error } = await supabase.from("revisions").insert({
      user_id: user.id,
      problem_id: problem.id,
    });

    if (!error) setSaved(true);
  }

  return (
    <div className="mt-6">
      <button
        onClick={markForRevision}
        disabled={saved}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
          saved
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 shadow-md"
        }`}
      >
        <span className="text-xl">⭐</span>
        <span>{saved ? "Saved for Revision" : "Mark for Revision"}</span>
      </button>

      {saved && (
        <p className="text-green-600 mt-3 flex items-center gap-2">
          <span>✓</span>
          <span>Added to your Revision List</span>
        </p>
      )}
    </div>
  );
}
