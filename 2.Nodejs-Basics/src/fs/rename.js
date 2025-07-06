import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";
import { isPathExist } from "../utils/isPathExist.js";

const rename = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const oldPath = path.join(dirName, "files", "wrongFilename.txt");
    const newPath = path.join(dirName, "files", "properFilename.md");

    const isExistNewPath = await isPathExist(newPath);

    if (isExistNewPath) {
      const error = new Error(`EEXIST: file or directory already exists, rename '${newPath}'`);
      error.code = "EEXIST";
      error.path = newPath;
      error.syscall = "rename";

      throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
    }

    await fs.rename(oldPath, newPath);
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await rename();
