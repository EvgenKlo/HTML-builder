const fs = require('node:fs');
const path = require('node:path');
const pathToFolder = path.join(__dirname, 'secret-folder')

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  files.forEach((item) => {
    let result = [];
    if (item.isFile()) {
      result.push(path.parse(item.name).name);
      result.push(path.parse(item.name).ext.slice(1));
      fs.stat(`${pathToFolder}/${item.name}`, (err, stats) => {
        //console.log((stats.size / 1024).toFixed(2) + 'kb');
        result.push((stats.size / 1024).toFixed(2) + 'kb');
        //console.log(stringResult)
      })
    }
    let stringResult = result.join(' - ');
    console.log(stringResult);
  })
});


//node 03-files-in-folder