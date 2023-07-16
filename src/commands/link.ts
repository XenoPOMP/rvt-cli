import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';

import { IS_DEV } from '../constants/isDev';
import { FileSystemManager } from '../utils/file-system-manager';
import { readdir } from 'fs/promises';

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

                  const localeBody = require(pathToLocale)[localeName];

                  const outputPath = path.join(
                    PATHS.localizationOutput,
                    localeName,
                    'messages.json'
                  );

                  /** Write localization file. */
                  fsManager.createEntity(
                    outputPath,
                    JSON.stringify(localeBody, null, 2),
                    {
                      commandInstance: this,
                    }
                  );
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
