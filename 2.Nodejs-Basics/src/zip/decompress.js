import { createReadStream, createWriteStream } from "fs";
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";

const decompress = async () => {
  try {
    const dirName = getDirName(import.meta.url);

    const pathToRead = path.join(dirName, "files", "archive.gz");
    const pathToDecompress = path.join(dirName, "files", "fileToCompress.txt");

    const readStream = createReadStream(pathToRead);
    const writeStream = createWriteStream(pathToDecompress);
    const decompressStream = createGunzip();

    await pipeline(readStream, decompressStream, writeStream);
  } catch (error) {
    throw new Error("file decompress error", { cause: error });
  }
};

await decompress();
