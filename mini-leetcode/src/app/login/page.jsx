"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e?.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/");
    else alert(error.message);
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-6 text-center">
            <h1 className="text-xl font-bold text-white">Login</h1>
            <p className="mt-1 text-indigo-200 text-sm">Sign in to continue</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 transition"
            >
              Login
            </button>
            <p className="text-center text-sm text-slate-500">
              No account?{" "}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
