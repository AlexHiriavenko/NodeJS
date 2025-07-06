import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";

const create = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const pathToFreshFile = path.join(dirName, "files", "fresh.txt");
    const freshFileContent = "I am fresh and young";

    await fs.writeFile(pathToFreshFile, freshFileContent, { flag: "wx" });
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await create();
