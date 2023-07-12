/**
 * This function creates files.
 *
 * @param {string} path       path to new file.
 * @param {string} data       data that has to be written to new file.
 */
export const createFile = (path: string, data: string): Promise<void> => {
  /** This function creates files. */
  const createNewFile = require('create-file');

  return new Promise((resolve, reject) => {
    createNewFile(path, data, (err: any) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
};
