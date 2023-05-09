const fs = require('node:fs');
const path = require('node:path');
const output = require('node:process');
const pathToTxt = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(pathToTxt, 'utf-8');
stream.on('data', (data) => {
  output.stdout.write(data);
});
