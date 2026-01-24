"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition"
          >
            💻 Mini LeetCode
          </Link>

          <nav className="flex gap-6 items-center">
            <Link 
              href="/revision" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
            >
              <span>⭐</span>
              <span>Revision</span>
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </Link>

            {user ? (
              <>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
