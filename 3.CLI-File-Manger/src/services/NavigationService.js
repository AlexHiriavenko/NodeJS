import fs from "fs/promises";
import path from "path";

export class NavigationService {
  goUp() {
    const currentPath = process.cwd();
    const rootPath = path.parse(currentPath).root;

    if (currentPath !== rootPath) {
      const parentPath = path.dirname(currentPath);
      process.chdir(parentPath);
    }
  }

  async getDirLs() {
    try {
      const items = await fs.readdir(process.cwd(), { withFileTypes: true });

      const folders = items
        .filter((item) => item.isDirectory())
        .map((item) => ({ Name: item.name, Type: "directory" }));
      const files = items
        .filter((item) => item.isFile())
        .map((item) => ({ Name: item.name, Type: "file" }));

      folders.sort((a, b) => a.Name.localeCompare(b.Name));
      files.sort((a, b) => a.Name.localeCompare(b.Name));

      return [...folders, ...files];
    } catch (err) {
      throw new Error("FS operation failed: readdir");
    }
  }

  async changeDirectory(pathArg) {
    if (!pathArg) {
      throw new Error("cd command requires a path argument");
    }

    const targetPath = path.isAbsolute(pathArg) ? pathArg : path.resolve(process.cwd(), pathArg);
    const root = path.parse(process.cwd()).root;

    if (!targetPath.startsWith(root)) {
      throw new Error("Access denied: cannot go above root");
    }

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isDirectory()) {
        throw new Error("Target path is not a directory");
      }

      process.chdir(targetPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        throw new Error("Directory does not exist");
      }
      throw new Error("Failed to change directory");
    }
  }
}
