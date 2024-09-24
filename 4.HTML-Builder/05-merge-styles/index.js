const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const sourcePath = path.join(__dirname, 'styles');
  const targetPath = path.join(__dirname, 'project-dist', 'bundle.css');

  // Чтение содержимого папки стилей
  const source = await fs.promises.readdir(sourcePath);
  // Создание целевого файла
  const writeStream = fs.createWriteStream(targetPath);

  // параметр для отступа при мердже
  let firstFile = true;

  // обработка файлов
  for (const file of source) {
    const filePath = path.join(sourcePath, file);
    const isCSS = path.extname(filePath) === '.css';

    if (isCSS) {
      // Чтение данных из файла
      const data = await fs.promises.readFile(filePath, 'utf-8');

      if (!firstFile) {
        // Добавление разделителя между файлами, кроме первого
        writeStream.write('\n');
      }

      // Запись данных в целевой файл
      writeStream.write(data);

      firstFile = false;
    }
  }

  // Завершение записи
  writeStream.end();
  console.log('Compilation completed.');
}

mergeStyles();

// <<<<<<<<< 2й вариант >>>>>>>>>>>>

// const fs = require('fs');
// const path = require('path');

// const sourcePath = path.join(__dirname, 'styles');
// const targetPath = path.join(__dirname, 'project-dist', 'bundle.css');

// fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }

//   const writeStream = fs.createWriteStream(targetPath);
//   console.log('path: ' + targetPath);

//   files.forEach((file, i) => {
//     const filePath = path.join(sourcePath, file.name);
//     const isFile = file.isFile();
//     const isCSS = path.extname(filePath) === '.css';

//     if (isFile && isCSS) {
//       const readStream = fs.createReadStream(filePath, {
//         encoding: 'utf-8',
//         highWaterMark: 64 * 1024,
//       });

//       readStream.on('data', (chunk) => {
//         if (i > 0) {
//           writeStream.write('\n');
//         }
//         writeStream.write(chunk);
//       });
//     }
//   });

//   writeStream.on('finish', () => {
//     console.log('Compilation completed.');
//     writeStream.close();
//   });
// });
