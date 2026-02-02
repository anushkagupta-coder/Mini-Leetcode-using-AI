import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export function runJsCode(code, input) {
  return new Promise((resolve, reject) => {
    // 1) Create a temp directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-"));
    const filePath = path.join(tmpDir, "main.js");

    // 2) Write user code to a temp file
    fs.writeFileSync(filePath, code);

    // 3) Execute with timeout
    const child = exec(
      `node "${filePath}"`,
      { timeout: 2000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        // Cleanup
        fs.rmSync(tmpDir, { recursive: true, force: true });

        if (error) {
  if (error.killed) {
    return reject("Time Limit Exceeded");
  }

  if (stderr?.includes("SyntaxError")) {
    return reject("Runtime Error: Syntax Error");
  }

  return reject("Runtime Error");
}
        resolve(stdout.trim());
      }
    );

    // 4) Provide input via stdin
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}
