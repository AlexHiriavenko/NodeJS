import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";

const remove = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const removePath = path.join(dirName, "files", "fileToRemove.txt");

    await fs.rm(removePath);
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await remove();
