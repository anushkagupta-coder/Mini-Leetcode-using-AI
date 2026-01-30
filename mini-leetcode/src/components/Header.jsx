"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
        >
          <span className="text-2xl">💻</span>
          CodeIQ AI 
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/revision"
            className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
          >
            ⭐ Revision
          </Link>

          {user ? (
            <>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition shadow-md shadow-indigo-500/25"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
