import { fileExists } from './fileExists';
import * as fs from 'fs';

export const createDir = (
  path: string,
  options?: Parameters<typeof fs.mkdirSync>[1],
): Promise<boolean | void> => {
  return fileExists(path).catch(() => {
    fs.mkdirSync(path, options);
  });
};
