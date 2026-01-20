export async function POST(req) {
  const { code } = await req.json();

  // 1️⃣ Empty code check
  if (!code || code.trim().length === 0) {
    return Response.json({
      result: "❌ No code submitted. Please write a solution.",
    });
  }

  // 2️⃣ Detect loops
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  // 3️⃣ Detect recursion
  const recursionDetected =
    code.includes("function") &&
    code.includes("(") &&
    code.includes("return") &&
    code.includes("(");

  // 4️⃣ Detect HashMap / Object / Map
  const usesHashing =
    code.includes("Map") ||
    code.includes("HashMap") ||
    code.includes("{}") ||
    code.includes("new Map");

  // 5️⃣ Detect sorting
  const usesSort = code.includes(".sort(");

  // 6️⃣ Detect return statement
  const hasReturn = code.includes("return");

  // 7️⃣ Time Complexity Estimation
  let timeComplexity = "O(1)";
  if (totalLoops === 1) timeComplexity = "O(n)";
  if (totalLoops >= 2) timeComplexity = "O(n²)";
  if (recursionDetected) timeComplexity = "O(recursive)";

  // 8️⃣ Space Complexity Estimation
  let spaceComplexity = "O(1)";
  if (usesHashing) spaceComplexity = "O(n)";
  if (recursionDetected) spaceComplexity = "O(call stack)";

  // 9️⃣ Suggestions (Dynamic)
  const suggestions = [];

  if (!hasReturn) {
    suggestions.push("Add a return statement to complete the solution.");
  }

  if (timeComplexity === "O(n²)") {
    suggestions.push(
      "Nested loops detected. Try optimizing using hashing or two-pointer technique."
    );
  }

  if (!usesHashing && timeComplexity === "O(n)") {
    suggestions.push(
      "You may optimize further using a HashMap for faster lookups."
    );
  }

  if (usesSort) {
    suggestions.push(
      "Sorting is used. Check if the problem allows a linear-time solution."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push("Good solution. The approach looks efficient.");
  }

  // 🔟 Final Result (Dynamic Output)
  const result = `
✅ Code Evaluation Report

Time Complexity:
${timeComplexity}

Space Complexity:
${spaceComplexity}

Observations:
- Loops detected: ${totalLoops}
- Hashing used: ${usesHashing ? "Yes" : "No"}
- Recursion used: ${recursionDetected ? "Yes" : "No"}

Suggestions:
- ${suggestions.join("\n- ")}
`;

  return Response.json({ result });
}
