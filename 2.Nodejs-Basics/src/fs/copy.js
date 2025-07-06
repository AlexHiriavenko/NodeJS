import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { isPathExist } from "../utils/isPathExist.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";

const copy = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const originalPath = path.join(dirName, "files");
    const copyPath = path.join(dirName, "files_copy");

    const isExistsCopyPath = await isPathExist(copyPath);

    if (isExistsCopyPath) {
      const error = new Error(`EEXIST: file or directory already exists, mkdir '${copyPath}'`);
      error.code = "EEXIST";
      error.path = copyPath;
      error.syscall = "mkdir";

      throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
    }

    await fs.cp(originalPath, copyPath, { recursive: true });
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await copy();
