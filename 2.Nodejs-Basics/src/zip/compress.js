import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";
import { getDirName } from "../utils/getDirName.js";

const compress = async () => {
  try {
    const dirName = getDirName(import.meta.url);

    const pathToRead = path.join(dirName, "files", "fileToCompress.txt");
    const pathToCompress = path.join(dirName, "files", "archive.gz");

    const readStream = createReadStream(pathToRead);
    const writeStream = createWriteStream(pathToCompress);
    const compressStream = createGzip();

    await pipeline(readStream, compressStream, writeStream);
  } catch (error) {
    throw new Error("file compress error", { cause: error });
  }
};

await compress();
