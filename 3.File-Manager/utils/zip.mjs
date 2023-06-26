import fs from "fs";
import zlib from "zlib";
import path from "path";

const compress = ({
  input,
  currentPath,
  showInvalidInputMessage,
  showFailMessage,
}) => {
  const oldPath = input.split(" ")[1];
  const newPath = input.split(" ")[2];
  const resolvedOldPath = path.resolve(currentPath, oldPath);
  const resolvedNewPath = path.resolve(currentPath, newPath);
  const fileName = path.parse(resolvedOldPath).base;
  const resolvedFullNewPath = path.resolve(resolvedNewPath, fileName);

  if (!oldPath || !newPath) {
    showInvalidInputMessage();
    return;
  } else if (
    !fs.existsSync(resolvedOldPath) ||
    fs.existsSync(resolvedFullNewPath) ||
    (fs.existsSync(resolvedNewPath) &&
      !fs.lstatSync(resolvedNewPath).isDirectory())
  ) {
    showFailMessage();
  } else {
    fs.createReadStream(resolvedOldPath)
      .pipe(zlib.createBrotliCompress())
      .pipe(fs.createWriteStream(resolvedFullNewPath))
      .on("error", showFailMessage);
  }
};

const decompress = ({
  input,
  currentPath,
  showInvalidInputMessage,
  showFailMessage,
}) => {
  const oldPath = input.split(" ")[1];
  const newPath = input.split(" ")[2];
  const resolvedOldPath = path.resolve(currentPath, oldPath);
  const resolvedNewPath = path.resolve(currentPath, newPath);
  const fileName = path.parse(resolvedOldPath).base;
  const resolvedFullNewPath = path.resolve(resolvedNewPath, fileName);

  if (!oldPath || !newPath) {
    showInvalidInputMessage();
    return;
  } else if (
    !fs.existsSync(resolvedOldPath) ||
    fs.existsSync(resolvedFullNewPath) ||
    (fs.existsSync(resolvedNewPath) &&
      !fs.lstatSync(resolvedNewPath).isDirectory())
  ) {
    showFailMessage();
  } else {
    fs.createReadStream(resolvedOldPath)
      .pipe(zlib.createBrotliDecompress())
      .pipe(fs.createWriteStream(resolvedFullNewPath))
      .on("error", showFailMessage);
  }
};

export { compress, decompress };
