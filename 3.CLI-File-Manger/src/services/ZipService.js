import fs from "fs";
import { pipeline } from "stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import path from "path";
import BaseFileService from "./BaseFileService.js";

class ZipService extends BaseFileService {
  async compress(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) {
      throw new Error("compress command requires two arguments: source and destination");
    }

    const absoluteSource = this.getAbsolutePath(sourcePath);
    let absoluteDest = this.getAbsolutePath(destinationPath);

    const sourceExists = await this.isPathExists(absoluteSource);
    if (!sourceExists) {
      throw new Error(`FS operation failed: source file does not exist: ${absoluteSource}`);
    }

    const sourceStats = await fs.promises.stat(absoluteSource);
    if (!sourceStats.isFile()) {
      throw new Error("FS operation failed: source is not a file");
    }

    const destExists = await this.isPathExists(absoluteDest);
    if (destExists) {
      const destStats = await fs.promises.stat(absoluteDest);

      if (destStats.isDirectory()) {
        const sourceName = path.parse(absoluteSource).name;
        const sourceFileName = sourceName + ".br";
        absoluteDest = path.join(absoluteDest, sourceFileName);
      } else {
        throw new Error(`FS operation failed: destination file already exists: ${absoluteDest}`);
      }
    }

    const finalExists = await this.isPathExists(absoluteDest);
    if (finalExists) {
      throw new Error(`FS operation failed: destination file already exists: ${absoluteDest}`);
    }

    const readStream = fs.createReadStream(absoluteSource);
    const writeStream = fs.createWriteStream(absoluteDest, { flags: "wx" });

    try {
      await pipeline(readStream, createBrotliCompress(), writeStream);
      return absoluteDest;
    } catch {
      throw new Error("FS operation failed: compress");
    }
  }

  async decompress(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) {
      throw new Error("decompress command requires two arguments: source and destination");
    }

    const absoluteSource = this.getAbsolutePath(sourcePath);
    let absoluteDest = this.getAbsolutePath(destinationPath);

    const sourceExists = await this.isPathExists(absoluteSource);
    if (!sourceExists) {
      throw new Error(`FS operation failed: source file does not exist: ${absoluteSource}`);
    }

    const sourceStats = await fs.promises.stat(absoluteSource);
    if (!sourceStats.isFile()) {
      throw new Error("FS operation failed: source is not a file");
    }

    const destExists = await this.isPathExists(absoluteDest);
    if (destExists) {
      const destStats = await fs.promises.stat(absoluteDest);

      if (destStats.isDirectory()) {
        const originalName = path.parse(absoluteSource).name;
        absoluteDest = path.join(absoluteDest, originalName);
      } else {
        throw new Error(`FS operation failed: destination file already exists: ${absoluteDest}`);
      }
    } else {
      const destParent = path.dirname(absoluteDest);
      const parentExists = await this.isPathExists(destParent);
      if (!parentExists) {
        throw new Error(`FS operation failed: destination directory does not exist: ${destParent}`);
      }
    }

    const finalExists = await this.isPathExists(absoluteDest);
    if (finalExists) {
      throw new Error(`FS operation failed: destination file already exists: ${absoluteDest}`);
    }

    const readStream = fs.createReadStream(absoluteSource);
    const writeStream = fs.createWriteStream(absoluteDest, { flags: "wx" });

    try {
      await pipeline(readStream, createBrotliDecompress(), writeStream);
      return absoluteDest;
    } catch {
      throw new Error("FS operation failed: decompress");
    }
  }
}

export default ZipService;
