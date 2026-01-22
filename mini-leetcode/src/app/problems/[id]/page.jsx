
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

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {problem.title}
      </h1>

      <p className="text-gray-700 mb-4">
        {problem.description}
      </p>

      <p className="mb-2">
        <b>Difficulty:</b> {problem.difficulty}
      </p>

      <p className="mb-6">
        <b>Tags:</b> {problem.tags?.join(", ")}
      </p>

    <ProblemActions problem={problem} />

      <Link
        href={`/evaluate?problemId=${problem.id}`}
        className="inline-block bg-black text-white px-6 py-2 rounded-lg"
      >
        Solve & Evaluate →
      </Link>
    </main>
  );
}
