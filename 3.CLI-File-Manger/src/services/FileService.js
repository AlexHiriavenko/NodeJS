import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { mkdir, rename, unlink } from "fs/promises";
import { pipeline } from "stream/promises";
import { TEXT_FILE_EXTENSIONS } from "../constants.js";
import BaseFileService from "./BaseFileService.js";

export class FileService extends BaseFileService {
  async readFile(filePath) {
    if (!filePath) {
      throw new Error("cat command requires a file path argument");
    }

    const absolutePath = this.getAbsolutePath(filePath);

    const isTextFile = TEXT_FILE_EXTENSIONS.some((ext) => absolutePath.endsWith(ext));
    const encoding = isTextFile ? "utf-8" : null;

    const stream = fs.createReadStream(absolutePath, { encoding: encoding });

    return new Promise((resolve, reject) => {
      let data = "";
      const chunks = [];

      stream.on("data", (chunk) => {
        if (isTextFile) {
          data += chunk;
        } else {
          chunks.push(chunk);
        }
      });

      stream.on("end", () => {
        resolve(isTextFile ? data : Buffer.concat(chunks));
      });

      stream.on("error", (err) => {
        if (err.code === "ENOENT") {
          reject(new Error(`ENOENT: no such file or directory, open '${absolutePath}'`));
        } else {
          reject(new Error("FS operation failed: readFile"));
        }
      });
    });
  }

  async createEmptyFile(fileName) {
    if (!fileName) {
      throw new Error("add command requires a file name");
    }

    const targetPath = path.resolve(process.cwd(), fileName);

    await new Promise((resolve, reject) => {
      const stream = createWriteStream(targetPath, { flags: "wx" });

      stream
        .on("open", () => {
          stream.end();
          resolve();
        })
        .on("error", reject);
    });
  }

  async createDirectory(dirName) {
    if (!dirName) {
      throw new Error("mkdir command requires a directory name");
    }

    const targetPath = path.resolve(process.cwd(), dirName);
    await mkdir(targetPath, { recursive: false });
  }

  async renameFile(oldPath, newFileName) {
    if (!oldPath || !newFileName) {
      throw new Error("rn command requires two arguments: path_to_file and new_filename");
    }

    const oldAbsolutePath = this.getAbsolutePath(oldPath);

    const newAbsolutePath = path.resolve(path.dirname(oldAbsolutePath), newFileName);

    const isExistsNewPath = await this.isPathExists(newAbsolutePath);

    if (isExistsNewPath) {
      throw new Error(`FS operation failed: file already exists at ${newAbsolutePath}`);
    }

    await rename(oldAbsolutePath, newAbsolutePath);
  }

  async copyFile(sourcePath, destinationDir) {
    if (!sourcePath || !destinationDir) {
      throw new Error("cp command requires two arguments: source file and target directory");
    }

    const absoluteSource = this.getAbsolutePath(sourcePath);

    const absoluteDestDir = this.getAbsolutePath(destinationDir);

    const fileName = path.basename(absoluteSource);
    const targetPath = path.join(absoluteDestDir, fileName);

    const fileExists = await this.isPathExists(targetPath);
    if (fileExists) {
      throw new Error(`FS operation failed: file already exists at ${targetPath}`);
    }

    const isSourceExists = await this.isPathExists(absoluteSource);
    const isDestExists = await this.isPathExists(absoluteDestDir);

    if (!isSourceExists || !isDestExists) {
      throw new Error(`FS operation failed: source or target does not exist: ${absoluteSource}`);
    }

    const sourceStats = await fs.promises.stat(absoluteSource);
    const destStats = await fs.promises.stat(absoluteDestDir);

    if (!sourceStats.isFile()) {
      throw new Error("FS operation failed: source is not a file");
    }

    if (!destStats.isDirectory()) {
      throw new Error("FS operation failed: destination is not a directory");
    }

    const readStream = fs.createReadStream(absoluteSource);
    const writeStream = fs.createWriteStream(targetPath, { flags: "wx" });

    try {
      await pipeline(readStream, writeStream);
    } catch (err) {
      throw new Error("FS operation failed: copyFile");
    }
  }

  async moveFile(sourcePath, destinationDir) {
    await this.copyFile(sourcePath, destinationDir);
    const absoluteSource = this.getAbsolutePath(sourcePath);
    await unlink(absoluteSource);
  }

  async deleteFile(filePath) {
    if (!filePath) {
      throw new Error("rm command requires a file path argument");
    }

    const absolutePath = this.getAbsolutePath(filePath);

    const exists = await this.isPathExists(absolutePath);
    if (!exists) {
      throw new Error(`FS operation failed: file does not exist at ${absolutePath}`);
    }

    const stats = await fs.promises.stat(absolutePath);
    if (!stats.isFile()) {
      throw new Error(`FS operation failed: target ${absolutePath} is not a file`);
    }

    await unlink(absolutePath);
  }
}
