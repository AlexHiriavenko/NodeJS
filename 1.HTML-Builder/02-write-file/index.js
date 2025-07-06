const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'check-this.txt');

// флаг 'a' - файл будет открыт для записи, если файл не существует, он будет создан. Если файл существует, данные будут добавлены в конец файла.
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface(stdin);

const startMessage =
  'Hello, write some text here. You will find it in "check-this.txt" file\n';
const endMessage = 'Thank you for review this task.';

stdout.write(startMessage);

rl.on('line', (input) => {
  const exit = input.trim().toLowerCase() === 'exit';
  if (exit) {
    process.exit();
  }
  fileStream.write(input + '\n');
});

process.on('exit', () => stdout.write(endMessage));
process.on('SIGINT', () => process.exit());
