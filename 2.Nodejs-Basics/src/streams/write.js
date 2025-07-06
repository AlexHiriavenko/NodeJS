import { createWriteStream } from "fs";
import path from "path";
import { getDirName } from "../utils/getDirName.js";

const write = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const pathToWriteFile = path.join(dirName, "files", "fileToWrite.txt");

    const writeStream = createWriteStream(pathToWriteFile, { flags: "w" });
    //   const writeStream = createWriteStream(pathToWriteFile, { flags: "a" });

    process.stdout.write("Please enter text to write into file. Press Ctrl+C to exit anytime.\n");

    process.stdin.on("data", (chunk) => {
      writeStream.write(chunk, (err) => {
        process.stdout.write("Writing completed successfully. Press Ctrl+C to exit or continue write.\n");
      });
    });

    process.stdin.resume();
  } catch (error) {
    throw new Error("write stream error", { cause: error });
  }
};

await write();
