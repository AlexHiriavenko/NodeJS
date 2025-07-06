import { createReadStream } from "fs";
import { createHash } from "crypto";
import path from "path";
import { getDirName } from "../utils/getDirName.js";

const calculateHash = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const readFile = path.join(dirName, "files", "fileToCalculateHashFor.txt");

    const readStream = createReadStream(readFile);
    const hash = createHash("sha256");

    readStream.pipe(hash).on("finish", () => {
      console.log(`SHA256 hash of 'fileToCalculateHashFor.txt': ${hash.digest("hex")}`);
    });
  } catch (error) {
    throw new Error("calculate file hash error", { cause: error });
  }
};

await calculateHash();
