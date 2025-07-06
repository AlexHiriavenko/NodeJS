import fs from "fs/promises";

export async function isPathExist(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
