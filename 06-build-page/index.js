const fs = require('node:fs');
const fsPromises = fs.promises;
const path = require('node:path');

let htmlData = '';

let htmlStremRead = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

htmlStremRead.on('data', (data) => {
  htmlData = data;
});

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
  fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, () => {
      fs.readdir(path.join(__dirname, 'assets'), { withFileTypes: true }, (err, files) => {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist', 'assets', file.name), (err) => {if (err) throw err;});
          } else {
            copyAssets(path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist', 'assets', file.name));
          }
        });
        fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
          files.forEach(file => {
            if (file.isFile()) {
              const fileExt = path.parse(file.name).ext.slice(1);
              if (fileExt === 'html') {
                const fileName = path.parse(file.name).name;
                const fileFullName = path.parse(file.name).base;
                fs.readFile(path.join(__dirname, 'components', fileFullName), 'utf-8', (err, files) => {
                  htmlData = htmlData.replace(`{{${fileName}}}`, `${files}`);
                  const writeStreamHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                  writeStreamHtml.write(htmlData);
                  writeStreamHtml.close();
                });
              }
            }
          });
        });
        fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
          let cssText = '';
          files.forEach(file => {
            if (file.isFile()) {
              const fileExt = path.parse(file.name).ext.slice(1);
              if (fileExt === 'css') {
                const fileFullName = path.parse(file.name).base;
                fsPromises.readFile(path.join(__dirname, 'styles', fileFullName), 'utf-8').then(fileText => {
                  cssText += fileText;
                  const writeStreamCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
                  writeStreamCss.write(cssText);
                  writeStreamCss.close();
                });
              }
            }
          });
        });
      });
    });
  });
});

function copyAssets (directoryOut, directoryIn) {
  fs.mkdir(directoryIn, { recursive: true }, () => {
    fs.readdir(directoryOut, { withFileTypes: true }, (err, files) => {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(directoryOut, file.name), path.join(directoryIn, file.name), (err) => {if (err) throw err;});
        } else {
          copyAssets(path.join(directoryOut, file.name), path.join(directoryIn, file.name));
        }
      });
    });
  });
}