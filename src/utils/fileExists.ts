import * as fs from 'fs';

export const fileExists = async (path: string): Promise<boolean> => {
  const exists = fs.existsSync(path);

  return new Promise<boolean>((resolve, reject) => {
    if (exists) {
      resolve(exists);
    } else {
      reject('File does not exists.');
    }
  });
};
