import { Command } from '@oclif/core';

import { fileExists } from './fileExists';
import { writeFile } from 'fs/promises';
import { inlinePrefix } from './inlinePrefix';
import { createFile } from './createFile';

/** This function creates entity. */
export const createEntity = (
  path: string,
  content: string,
  options: {
    commandInstance: Command;
    noLog?: boolean;
  },
) => {
  const logger = options?.commandInstance;

  fileExists(path)
    .then(() => {
      writeFile(path, content)
        .then(() => {
          if (!options?.noLog) {
            logger.log(inlinePrefix(path, 'update'));
          }
        })
        .catch(logger.error);
    })
    .catch(() => {
      createFile(path, content)
        .then(() => {
          if (!options?.noLog) {
            logger.log(inlinePrefix(path, 'create'));
          }
        })
        .catch(logger.error);
    });
};
