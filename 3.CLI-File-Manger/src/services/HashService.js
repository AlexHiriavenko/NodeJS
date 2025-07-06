import fs from "fs";
import crypto from "crypto";
import BaseFileService from "./BaseFileService.js";
import { pipeline } from "stream/promises";

class HashService extends BaseFileService {
  async calculateHash(filePath) {
    if (!filePath) {
      throw new Error("hash command requires a file path argument");
    }

    const absolutePath = this.getAbsolutePath(filePath);

    const exists = await this.isPathExists(absolutePath);
    if (!exists) {
      throw new Error(`FS operation failed: file does not exist: ${absolutePath}`);
    }

    const stats = await fs.promises.stat(absolutePath);
    if (!stats.isFile()) {
      throw new Error("FS operation failed: path is not a file");
    }

    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(absolutePath);

    await pipeline(stream, hash);

    return hash.digest("hex");
  }
}

export default HashService;
