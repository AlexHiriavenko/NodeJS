import { access } from "fs/promises";
import path from "path";

class BaseFileService {
  async isPathExists(pathArg) {
    try {
      await access(pathArg);
      return true;
    } catch {
      return false;
    }
  }

  getAbsolutePath(inputPath) {
    return path.isAbsolute(inputPath) ? inputPath : path.resolve(process.cwd(), inputPath);
  }
}

export default BaseFileService;
