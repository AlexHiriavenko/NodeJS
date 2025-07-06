import fs from "fs/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";
import { DEFAULT_FS_ERROR_MESSAGE } from "../constants.js";

const list = async () => {
  try {
    const dirName = getDirName(import.meta.url);
    const folderPath = path.join(dirName, "files");

    const foldersAndFilesDirents = await fs.readdir(folderPath, { withFileTypes: true });

    const fileNames = foldersAndFilesDirents
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    console.log(fileNames);
  } catch (error) {
    throw new Error(DEFAULT_FS_ERROR_MESSAGE, { cause: error });
  }
};

await list();
