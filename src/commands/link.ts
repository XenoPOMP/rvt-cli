import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';

import { IS_DEV } from '../constants/isDev';
import { colors } from '../utils/colors';
import { FileSystemManager } from '../utils/file-system-manager';
import { readFile, readdir } from 'fs/promises';

const shell = require('shelljs');

export default class Link extends Command {
  static description = 'describe the command here';

  static examples = [
    '<%= config.bin %> <%= command.id %> locales - link locales in Chrome Extension project',
  ];

  static flags = {};

  static args = {
    type: Args.string({
      description: 'type of linking entity',
      required: true,
      options: ['locales'],
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link);

    const fsManager = new FileSystemManager();

    const PROJECT_DIR = process.cwd();
    const PATHS = ((cwd = PROJECT_DIR) => {
      return {
        localization: path.join(cwd, 'src/assets/localization'),
        localizationOutput: path.join(cwd, '.rvt/manifests/chrome/_locales'),
      };
    })();

    switch (args.type) {
      case 'locales': {
        await Promise.all([fsManager.fileExists(PATHS.localization)])
          .then(() => {
            this.log('All directories exist.');

            readdir(path.join(PATHS.localization, 'locales')).then(files => {
              files
                .filter(file => !/.*.js/gi.test(file))
                .map(file => {
                  const pathToLocale = path.join(
                    PATHS.localization,
                    'locales',
                    file
                  );

                  const localeName = file.replace(/.ts$/i, '');

                  const outputPath = path.join(
                    PATHS.localizationOutput,
                    localeName,
                    'messages.json'
                  );

                  readFile(pathToLocale, {
                    encoding: 'utf-8',
                  })
                    .then(text => {
                      const replacePattern = new RegExp(
                        `(import .*$)|(export const ${localeName}Locales.*$(\n.*$)*)`,
                        'gim'
                      );

                      return text.replace(replacePattern, '');
                    })
                    .then(text => {
                      return text.replace(
                        new RegExp(`(^export.*$)|(^\};$)`, 'gim'),
                        ''
                      );
                    })
                    .then(text => {
                      return text
                        .replace(/['`]/gi, '"')
                        .replace(/\n{2,}/gi, '')
                        .replace(/\w+(?=:)/gi, oldValue => {
                          return `"${oldValue.replace(/:$/gi, '')}"`;
                        })
                        .replace(/\n/gi, ' ')
                        .replace(/\s{2,}/gi, ' ')
                        .replace(/,\s},$/gi, ' }');
                    })
                    .then(text => `{ ${text.replace(/,$/gi, '')} }`)
                    .then(modifiedText => {
                      const toJson = JSON.parse(modifiedText);
                      const jsonText = JSON.stringify(toJson, null, 2);

                      fsManager.createEntity(outputPath, jsonText, {
                        commandInstance: this,
                      });
                    });
                });
            });
          })
          .catch(() => {
            this.error('Localization files are not created.');
          });
        break;
      }
    }
  }
}
