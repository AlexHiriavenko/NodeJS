import { createReadStream } from "fs";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";
import { pipeline } from "stream/promises";

const read = async () => {
  try {
    console.log("Press Ctrl+C (Windows/Linux) or Cmd+C (Mac) to exit. \n");
    const dirName = getDirName(import.meta.url);
    const pathToReadFile = path.join(dirName, "files", "fileToRead.txt");

    const readStream = createReadStream(pathToReadFile);

    await pipeline(readStream, process.stdout);

    process.stdin.resume();
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await read();
