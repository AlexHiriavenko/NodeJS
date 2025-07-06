import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";

const read = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const readPath = path.join(dirName, "files", "fileToRead.txt");

    const fileContent = await fs.readFile(readPath, { encoding: "utf-8" });

    console.log(fileContent);
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await read();
