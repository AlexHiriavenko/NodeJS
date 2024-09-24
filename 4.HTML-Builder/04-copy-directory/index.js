const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const sourcePath = path.join(__dirname, 'files');
const distPath = path.join(__dirname, 'files-copy');

async function copyDir(source, dist) {
  // Clear the dist folder
  await fs.promises.rm(dist, { force: true, recursive: true });

  // Create dist folder
  await fs.promises.mkdir(dist, { recursive: true });

  // Contents of source folder
  const sourceContents = await fs.promises.readdir(source, {
    withFileTypes: true,
  });

  // Copy all files and directories from source to dist
  const copyPromises = sourceContents.map(async (entry) => {
    const entrySource = path.join(source, entry.name);
    const entryDist = path.join(dist, entry.name);

    if (entry.isDirectory()) {
      await copyDir(entrySource, entryDist);
    } else {
      const readStream = fs.createReadStream(entrySource);
      const writeStream = fs.createWriteStream(entryDist);

      await new Promise((resolve, reject) => {
        pipeline(readStream, writeStream, (err) => {
          if (err) reject(err);
        });
        writeStream.on('finish', resolve);
      });
    }
  });

  await Promise.allSettled(copyPromises);
}

copyDir(sourcePath, distPath);
