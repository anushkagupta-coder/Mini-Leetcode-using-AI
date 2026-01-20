import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*");

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Mini LeetCode Problems
      </h1>

      {error && <p className="text-red-500">{error.message}</p>}

      <div className="space-y-4">
        {problems?.map((problem) => (
          <div
            key={problem.id}
            className="border p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold">
              {problem.title}
            </h2>

            <p className="text-gray-600 mt-1">
              {problem.description}
            </p>

            <div className="mt-2 text-sm">
              <span className="font-medium">
                Difficulty:
              </span>{" "}
              {problem.difficulty}
            </div>

            <div className="mt-1 text-sm">
              <span className="font-medium">Tags:</span>{" "}
              {problem.tags.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
