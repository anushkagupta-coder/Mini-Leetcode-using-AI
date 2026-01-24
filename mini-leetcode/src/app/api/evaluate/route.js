export async function POST(req) {
  try {
    const { code, problemId, testCases } = await req.json();

    // 1️⃣ Empty code check
    if (!code || code.trim().length === 0) {
      return Response.json({
        success: false,
        error: "No code submitted. Please write a solution.",
        analysis: null,
      });
    }

    // 2️⃣ Execute code with test cases
    let executionResults = [];
    let hasRuntimeError = false;
    let runtimeError = null;

    if (testCases && testCases.length > 0) {
      try {
        // Create a safe execution environment
        const Function = globalThis.Function;
        const safeCode = `
          ${code}
          
          // Test runner
          const testResults = [];
          const testCases = ${JSON.stringify(testCases)};
          
          // Find the function to test - check common function names
          let testFunction = null;
          
          // Check for common function names
          if (typeof solution !== 'undefined' && typeof solution === 'function') {
            testFunction = solution;
          } else if (typeof twoSum !== 'undefined' && typeof twoSum === 'function') {
            testFunction = twoSum;
          } else if (typeof maxProfit !== 'undefined' && typeof maxProfit === 'function') {
            testFunction = maxProfit;
          } else if (typeof containsDuplicate !== 'undefined' && typeof containsDuplicate === 'function') {
            testFunction = containsDuplicate;
          } else if (typeof reverseString !== 'undefined' && typeof reverseString === 'function') {
            testFunction = reverseString;
          } else {
            // Try to find any function in the global scope
            const globalVars = Object.getOwnPropertyNames(this);
            for (const varName of globalVars) {
              if (varName !== 'testResults' && varName !== 'testCases' && 
                  typeof this[varName] === 'function' && 
                  !varName.startsWith('_')) {
                testFunction = this[varName];
                break;
              }
            }
          }
          
          if (!testFunction) {
            throw new Error('No function found. Please define a function named "solution" or use a standard function name.');
          }
          
          for (let i = 0; i < testCases.length; i++) {
            const test = testCases[i];
            try {
              const result = testFunction(...test.input);
              const passed = JSON.stringify(result) === JSON.stringify(test.expected);
              testResults.push({
                testCase: i + 1,
                input: test.input,
                expected: test.expected,
                output: result,
                passed: passed
              });
            } catch (err) {
              testResults.push({
                testCase: i + 1,
                input: test.input,
                expected: test.expected,
                output: null,
                passed: false,
                error: err.message
              });
            }
          }
          
          testResults;
        `;

        const executeFunction = new Function(safeCode);
        executionResults = executeFunction();
      } catch (err) {
        hasRuntimeError = true;
        runtimeError = err.message;
      }
    }

    // 3️⃣ Code Analysis
    const forLoops = (code.match(/for\s*\(/g) || []).length;
    const whileLoops = (code.match(/while\s*\(/g) || []).length;
    const totalLoops = forLoops + whileLoops;

    const recursionDetected =
      code.includes("function") &&
      (code.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*\w+\s*\(/g) || []).length > 0;

    const usesHashing =
      code.includes("Map") ||
      code.includes("HashMap") ||
      code.includes("Set") ||
      (code.match(/\{\s*[^}]*:/g) || []).length > 0 ||
      code.includes("new Map") ||
      code.includes("new Set");

    const usesSort = code.includes(".sort(");
    const hasReturn = code.includes("return");

    // Time Complexity Estimation
    let timeComplexity = "O(1)";
    if (totalLoops === 1) timeComplexity = "O(n)";
    if (totalLoops >= 2) timeComplexity = "O(n²)";
    if (recursionDetected) timeComplexity = "O(2^n) or O(n!)";
    if (usesSort) timeComplexity = "O(n log n)";

    // Space Complexity Estimation
    let spaceComplexity = "O(1)";
    if (usesHashing) spaceComplexity = "O(n)";
    if (recursionDetected) spaceComplexity = "O(n) [call stack]";
    if (usesSort) spaceComplexity = "O(1) or O(n)";

    // Suggestions
    const suggestions = [];
    const warnings = [];

    if (!hasReturn) {
      warnings.push("⚠️ Missing return statement. Ensure your function returns a value.");
    }

    if (timeComplexity === "O(n²)") {
      suggestions.push("💡 Consider optimizing nested loops using hashing or two-pointer technique.");
    }

    if (!usesHashing && timeComplexity === "O(n)") {
      suggestions.push("💡 You may optimize further using a HashMap/Set for O(1) lookups.");
    }

    if (usesSort && timeComplexity.includes("O(n")) {
      suggestions.push("💡 Check if a linear-time solution is possible without sorting.");
    }

    if (suggestions.length === 0 && !hasRuntimeError) {
      suggestions.push("✅ Good solution! The approach looks efficient.");
    }

    // Calculate test results
    const passedTests = executionResults.filter(r => r.passed).length;
    const totalTests = executionResults.length;
    const allPassed = totalTests > 0 && passedTests === totalTests;

    return Response.json({
      success: !hasRuntimeError && (totalTests === 0 || allPassed),
      error: hasRuntimeError ? runtimeError : null,
      testResults: executionResults,
      passedTests,
      totalTests,
      allPassed,
      analysis: {
        timeComplexity,
        spaceComplexity,
        observations: {
          loops: totalLoops,
          hashing: usesHashing,
          recursion: recursionDetected,
          sorting: usesSort,
        },
        suggestions,
        warnings,
      },
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message || "An error occurred during evaluation",
      analysis: null,
    });
  }
}
