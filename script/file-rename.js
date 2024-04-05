import fs from 'fs';
import path from 'path';

const fileDir = process.argv[2];

if (fileDir) {
  while (1) {
    const files = fs.readdirSync(fileDir);
    let flag = false;
    files.forEach((file, index) => {
      if (index > 0 && file.endsWith('png')) {
        let curFileNumber = +file.replace('.png', '');
        const preFileNumber = +files[index - 1].replace('.png', '');
        if (curFileNumber - preFileNumber > 1) {
          flag = true;
          curFileNumber = preFileNumber + 1;
          const newFile = path.join(fileDir, `${curFileNumber}.png`);
          const oldFile = path.join(fileDir, file);
          fs.renameSync(oldFile, newFile);
        }
      }
    });
    if (!flag) {
      break;
    }
  }
}

// const fileDir = path.resolve(__dirname, 'img');
