import { fileURLToPath } from 'url';
import path from 'path';

export function getDirName(metaUrl) {
  const filename = fileURLToPath(metaUrl);
  return path.dirname(filename);
}