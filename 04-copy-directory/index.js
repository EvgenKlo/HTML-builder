const fs = require('node:fs');
const fsPromises = fs.promises;
const path = require('node:path');

fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }).then(
  fsPromises.readdir(path.join(__dirname, 'files-copy')).then(files => {
    files.forEach(file => {
      fsPromises.unlink(path.join(__dirname, 'files-copy', file));
    });
  }),
  fsPromises.readdir(path.join(__dirname, 'files')).then(files => {
    files.forEach(file => {
      fsPromises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    });
  })
);
