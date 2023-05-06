const { rejects } = require('node:assert');
const fs = require('node:fs');
const fsPromises = fs.promises;
const path = require('node:path');

let htmlData = '';

let htmlStremRead = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

htmlStremRead.on('data', (data) => {
  htmlData = data;
})

const createProjectDist = new Promise((resolve, rejects) => {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
    fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
    })
    resolve()
  })
})

createProjectDist.then(() => {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, () => {})
  const cleanProjectDist = new Promise ((resolve, rejects) => {
    fs.readdir(path.join(__dirname, 'project-dist'), { withFileTypes: true }, (err, files) => {
      if (files.length > 0) {
        files.forEach(file => {
          if (file.isFile()) {
            fs.unlink(path.join(__dirname, 'project-dist', file.name), () => {});
          } else {
            cleanDist(path.join(__dirname, 'project-dist', file.name));
          }
        })
      }
      resolve()
    })
  })

  cleanProjectDist.then(() => {
    const copyAssetsFolder = new Promise((resolve, rejects) => {
      fs.readdir(path.join(__dirname, 'assets'), { withFileTypes: true }, (err, files) => {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist', 'assets', file.name), (err) => {if (err) throw err});
          } else {
            copyAssets(path.join(__dirname, 'assets', file.name), path.join(__dirname, 'project-dist', 'assets', file.name))
          }
        })
        resolve()
      })
    })

    copyAssetsFolder.then(() => {
      const createHtml = new Promise ((resolve, rejects) => {
        fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
          files.forEach(file => {
            if (file.isFile()) {
              const fileExt = path.parse(file.name).ext.slice(1);
              if (fileExt === 'html') {
                const fileName = path.parse(file.name).name;
                const fileFullName = path.parse(file.name).base;
                fsPromises.readFile(path.join(__dirname, 'components', fileFullName), 'utf-8').then(fileText => {
                  htmlData = htmlData.replace(`{{${fileName}}}`, `${fileText}`);
                  const writeStreamHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                  writeStreamHtml.write(htmlData);
                  writeStreamHtml.close();
                })
              }
            }
          })
        })
      })
    })
  })
})

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  let cssText = '';
    files.forEach(file => {
      if (file.isFile()) {
        const fileExt = path.parse(file.name).ext.slice(1);
        if (fileExt === 'css') {
          const fileName = path.parse(file.name).name;
          const fileFullName = path.parse(file.name).base;
          const textCss = '';
          fsPromises.readFile(path.join(__dirname, 'styles', fileFullName), 'utf-8').then(fileText => {
            cssText += fileText
            const writeStreamCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
            writeStreamCss.write(cssText);
            writeStreamCss.close();
          })
        }
      }
    })
  }
)



function cleanDist (directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (files.length > 0) {
      files.forEach(file => {
        if (file.isFile()) {
          fs.unlink(path.join(directory, file.name), () => {});
        } else {
          cleanDist(path.join(directory, file.name));
        }
      })
    } else {
      fs.rmdir(directory, () => {})
    }
  })
}

function copyAssets (directoryOut, directoryIn) {
  fs.mkdir(directoryIn, { recursive: true }, () => {
    fs.readdir(directoryOut, { withFileTypes: true }, (err, files) => {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(directoryOut, file.name), path.join(directoryIn, file.name), (err) => {if (err) throw err})
        } else {
          copyAssets(path.join(directoryOut, file.name), path.join(directoryIn, file.name))
        }
      })
    })
  })
}

// node 06-build-page