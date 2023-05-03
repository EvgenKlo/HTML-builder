const { rejects } = require('node:assert');
const fs = require('node:fs');
const fsPromises = fs.promises;
const path = require('node:path');

fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8').then(data => {
  fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true}).then(files => {
    fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }).then(
      //fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets')),
      fsPromises.readdir(path.join(__dirname, 'project-dist')).then(files => {
        files.forEach(file => {
          fsPromises.unlink(path.join(__dirname, 'project-dist', file))
        })
      })
    )
    files.forEach(file => {
      if (file.isFile()) {
        const fileExt = path.parse(file.name).ext.slice(1);
        if (fileExt === 'html') {
          const fileName = path.parse(file.name).name;
          const fileFullName = path.parse(file.name).base;
          fsPromises.readFile(path.join(__dirname, 'components', fileFullName), 'utf-8').then(fileText => {
            data = data.replace(`{{${fileName}}}`, `${fileText}`);
            const writeStreamHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
            writeStreamHtml.write(data);
            writeStreamHtml.close();
          })
        }
      }
    })
  })
  fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then(files => {
    let cssText = '';
    files.forEach(file => {
      if (file.isFile()) {
        const fileExt = path.parse(file.name).ext.slice(1);
        if (fileExt === 'css') {
          const fileName = path.parse(file.name).name;
          const fileFullName = path.parse(file.name).base;
          const textCss = ''
          fsPromises.readFile(path.join(__dirname, 'styles', fileFullName), 'utf-8').then(fileText => {
            cssText += fileText
            const writeStreamCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
            writeStreamCss.write(cssText);
          })
        }
      }
    })
  })
})

// node 06-build-page