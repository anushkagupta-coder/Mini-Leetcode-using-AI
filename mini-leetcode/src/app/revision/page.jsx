"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function diffClass(d) {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (d === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  if (d === "Hard") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

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

      if (!error) setItems(data || []);
    }

    fetchRevisions();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">⭐ Your Revision List</h1>
          <p className="mt-1 text-slate-600">Problems you’ve saved for later</p>
        </div>

        {items.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">No problems saved for revision yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Browse problems →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <Link key={item.problem_id} href={`/problems/${item.problems?.id}`}>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200/60 transition-all duration-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">{item.problems?.title}</h2>
                  <div className="mt-1.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium border ${diffClass(item.problems?.difficulty)}`}>
                      {item.problems?.difficulty}
                    </span>
                  </div>
                </div>
                <span className="text-amber-500">⭐</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
