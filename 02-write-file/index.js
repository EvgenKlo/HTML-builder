const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

const pathToTxt = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(pathToTxt, 'utf-8');

const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

rl.write('Не хочешь ли ты мне что-то рассказать?\n');

rl.on('line', answer => {
  if (answer !== 'exit') {
    stream.write(`${answer}\n`);
  } else {
    rl.close();
  }
});

process.on('exit', () => {
  console.log('Это будет вечно храниться в недрах Тайной комнаты!');
});
