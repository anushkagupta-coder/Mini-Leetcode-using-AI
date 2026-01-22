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

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        ⭐ Your Revision List
      </h1>

      {items.length === 0 && (
        <p className="text-gray-500">
          No problems saved for revision yet.
        </p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.problem_id}
            href={`/problems/${item.problems.id}`}
          >
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h2 className="font-semibold">
                {item.problems.title}
              </h2>
              <p className="text-sm text-gray-500">
                Difficulty: {item.problems.difficulty}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
