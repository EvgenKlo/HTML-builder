const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

const pathToTxt = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(pathToTxt, 'utf-8');
const myTxt = fs.createReadStream(pathToTxt);

myTxt.on('data', chunk => console.log(chunk) /* stream.write(chunk) */);

/* const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Не хочешь ли ты мне что-то рассказать?\n', (answer) => {
  if (answer !== 'exit') {
    myTxt.on('data', chunk => stream.write(chunk));
  } else {
    console.log('Это будет вечно храниться в недрах Тайной комнаты!');
    rl.close();
  }
  rl.on('line', (output) => {
    if (output !== 'exit') {
      myTxt.on('data', chunk => stream.write(chunk));
    } else {
      console.log('Это будет вечно храниться в недрах Тайной комнаты!');
      rl.close();
    }
  });
}); */

//node 02-write-file