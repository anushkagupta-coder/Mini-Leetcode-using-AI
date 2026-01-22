"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Mini LeetCode
      </Link>

      <nav className="flex gap-4 items-center">
        <Link href="/revision">Revision</Link>

        {user ? (
          <>
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
