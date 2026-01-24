
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import ProblemActions from "./ProblemActions";

export default async function ProblemDetail({ params }) {
  const { id } = await params; // ✅ THIS IS THE FIX

  if (!id) {
    return <p className="p-6 text-red-500">Invalid problem ID</p>;
  }

  const { data: problem, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return (
      <p className="p-6 text-red-500">
        Error: {error.message}
      </p>
    );
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Hard: "bg-red-100 text-red-800 border-red-300",
  };

  const difficultyColor = difficultyColors[problem.difficulty] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              {problem.title}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold border-2 ${difficultyColor}`}>
                {problem.difficulty}
              </span>
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="prose max-w-none mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>
            </div>

            <ProblemActions problem={problem} />

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                href={`/evaluate?problemId=${problem.id}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-xl">🚀</span>
                <span>Solve & Evaluate Code</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
