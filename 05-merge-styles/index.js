const fs = require('node:fs');
const fsPromises = fs.promises;
const path = require('node:path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then(files => {
  files.forEach(file => {
    if (file.isFile()) {
      const fileExt = path.parse(file.name).ext.slice(1);
      if (fileExt === 'css') {
        const stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        stream.on('data', (data) => {
          writeStream.write(data)
        })
      }
    }
  })
})
