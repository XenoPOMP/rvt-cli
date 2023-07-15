import * as fs from 'fs';
import * as shell from 'shelljs';
import { Command } from '@oclif/core';
import { unlink, writeFile } from 'fs/promises';

import { inlinePrefix } from './inlinePrefix';

const rmdir = require('rm-dir');

export class FileSystemManager {
  public fileExists = async (path: string): Promise<boolean> => {
    const exists = fs.existsSync(path);

    return new Promise<boolean>((resolve, reject) => {
      if (exists) {
        resolve(exists);
      } else {
        reject('File does not exists.');
      }
    });
  };

  /**
   * This method creates files.
   *
   * @param {string} path       path to new file.
   * @param {string} data       data that has to be written to new file.
   */
  public createFile = (path: string, data: string): Promise<void> => {
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

  public getNestedPath = (root: string, nested: string): string => {
    const pattern = /(^\\{1,2})|(\\{1,2}$)/i;

    return nested.replace(root, '').replace(pattern, '');
  };

  /**
   * This method creates entity.
   *
   * @param path
   * @param content
   * @param options
   */
  public createEntity = (
    path: string,
    content: string,
    options: {
      commandInstance: Command;
      noLog?: boolean;
    },
  ) => {
    const logger = options.commandInstance;

    this.fileExists(path)
      .then(() => {
        writeFile(path, content)
          .then(() => {
            if (!options?.noLog) {
              logger.log(
                inlinePrefix(this.getNestedPath(process.cwd(), path), 'update'),
              );
            }
          })
          .catch(logger.error);
      })
      .catch(() => {
        this.createFile(path, content)
          .then(() => {
            if (!options?.noLog) {
              logger.log(
                inlinePrefix(this.getNestedPath(process.cwd(), path), 'create'),
              );
            }
          })
          .catch(logger.error);
      });
  };

  /**
   * This method created directory.
   *
   * @param path
   * @param options
   */
  public createDir = (
    path: string,
    options?: Parameters<typeof fs.mkdirSync>[1],
  ): Promise<boolean | void> => {
    return this.fileExists(path).catch(() => {
      fs.mkdirSync(path, options);
    });
  };
}
