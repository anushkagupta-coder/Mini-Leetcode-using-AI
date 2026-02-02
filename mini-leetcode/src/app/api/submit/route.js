import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runJsCode } from "@/lib/jsSandbox";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(req) {
  try {
    // 1️⃣ Read request body
    const { problemId, code } = await req.json();

    if (!problemId || !code) {
      return NextResponse.json(
        { error: "problemId and code are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch test cases
    const { data: testCases, error } = await supabase
      .from("test_cases")
      .select("input, expected_output, is_hidden")
      .eq("problem_id", problemId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!testCases || testCases.length === 0) {
      return NextResponse.json(
        { error: "No test cases found" },
        { status: 404 }
      );
    }

    // 3️⃣ Execute code against ALL test cases
    for (const tc of testCases) {
      let output;

      try {
        output = await runJsCode(code, tc.input);
      } catch (executionError) {
        return NextResponse.json(
          { verdict: executionError },
          { status: 200 }
        );
      }

      if (output.trim() !== tc.expected_output.trim()) {
        return NextResponse.json(
          {
            verdict: "Wrong Answer",
            failedTestCase: tc.is_hidden
              ? "Hidden Test Case"
              : tc.input,
          },
          { status: 200 }
        );
      }
    }

    // 4️⃣ All test cases passed
    return NextResponse.json(
      { verdict: "Accepted" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Submit API crashed:", err);
    return NextResponse.json(
      { error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
