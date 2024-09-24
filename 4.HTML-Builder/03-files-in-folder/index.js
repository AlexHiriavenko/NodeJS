const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => getStatsFromDir(err, files));

// разделить логику обработки списка файлов и логику получения статистики для каждого файла.

function getStatsFromDir(err, files) {
  if (err) {
    console.error(`Error reading directory: ${err.message}`);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    getFileStats(filePath, file);
  });
}

function getFileStats(filePath, file) {
  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      console.error(`error getting stats: ${statErr.message}`);
      return;
    }

    if (stats.isFile()) {
      const fileSize = (stats.size / 1024).toFixed(2) + 'kb';
      const fileName = path.parse(file).name;
      const fileExt = path.parse(file).ext.slice(1);

      console.log(`${fileName} - ${fileExt} - ${fileSize}`);
    }
  });
}
