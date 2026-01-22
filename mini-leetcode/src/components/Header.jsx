import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">
          Mini LeetCode
        </h1>


        <nav className="space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-gray-300">
            Problems
          </Link>
          <Link href="/leaderboard" className="hover:text-gray-300">
            Leaderboard
          </Link>
          <Link href="/evaluate" className="hover:text-gray-300">
            Evaluate
          </Link>
        </nav>
      </div>
    </header>
  );
}
