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
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
          saved
            ? "bg-emerald-100 text-emerald-700 cursor-default"
            : "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
        }`}
      >
        ⭐ {saved ? "Added to Revision" : "Mark for Revision"}
      </button>
      {saved && (
        <p className="text-emerald-600 text-sm mt-2">Added to your Revision List</p>
      )}
    </div>
  );
}


