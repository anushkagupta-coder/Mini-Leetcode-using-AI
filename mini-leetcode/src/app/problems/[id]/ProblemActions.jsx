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
        className="px-4 py-2 bg-yellow-400 text-black rounded-lg"
      >
        ⭐ Mark for Revision
      </button>

      {saved && (
        <p className="text-green-600 mt-2">
          Added to your Revision List
        </p>
      )}
    </div>
  );
}
