const fs = require('node:fs');
const path = require('node:path');
const pathToFolder = path.join(__dirname, 'secret-folder')

fs.promises.readdir(pathToFolder, {withFileTypes: true}).then(output => {
  output.forEach(item => {
    if (item.isFile()) {
      const pathToFile = path.join(pathToFolder, item.name);
      const fileName = path.parse(item.name).name
      const fileExt = path.parse(item.name).ext.slice(1);
      fs.promises.stat(pathToFile).then(file => {
        const resultArr = [fileName, fileExt, (file.size / 1024).toFixed(2).toString() + ' kb'];
        console.log(resultArr.join(' - '))
      })
    }
  })
})
