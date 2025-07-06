import { spawn } from "child_process";
import path from "path";
import { getDirName } from "../utils/getDirName.js";

const spawnChildProcess = async (args) => {
  try {
    const dirName = getDirName(import.meta.url);
    const scriptPath = path.join(dirName, "files", "script.js");

    const child = spawn("node", [scriptPath, ...args], {
      stdio: ["pipe", "pipe", "inherit"],
    });

    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);

    child.on("error", (error) => {
      console.error("Child process failed to start:", error.message);
    });
  } catch (error) {
    console.error("Failed to spawn child process:", error.message);
  }
};

// Put your arguments in function call to test this functionality
await spawnChildProcess(["arg1", "arg2"]);
