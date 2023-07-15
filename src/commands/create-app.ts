import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as shell from 'shelljs';

import { colors } from '../utils/colors';
import { FileSystemManager } from '../utils/file-system-manager';

export default class CreateApp extends Command {
  static description = 'describe the command here';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    // template: Flags.string({
    //   char: 't',
    //   description: 'choose template',
    //   required: false,
    //   options: ['redux', 'zustand'],
    //   default: undefined,
    // }),
  };

  static args = {
    projectName: Args.string({
      description: 'Name of project',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CreateApp);
    const { projectName } = args;
    const { template } = flags;

    const fsManager = new FileSystemManager();

    const PROJECT_DIR = process.cwd();

    const normalizedName = path.normalize(projectName);

    const isValid = require('is-valid-path');

    /** Check if given path is valid. */
    if (!isValid(normalizedName)) {
      this.error(
        `${colors.red('Given path')} ${colors.green(
          colors.italic(normalizedName),
        )} ${colors.red('is not valid.')}`,
      );
    }

    const PATHS = ((cwd = PROJECT_DIR) => {
      return {
        root: path.join(cwd, normalizedName),
      };
    })();

    const command = [
      `git clone https://github.com/XenoPOMP/react-vite-template.git --branch=master "${PATHS.root}"`,
      `rmdir /s /q \"${path.join(PATHS.root, '.git')}\"`,
      'cls',
    ].join(' && ');

    await shell
      .exec(command, {
        async: true,
      })
      .on('close', () => {
        const generatedPackageJson = require(path.join(
          PATHS.root,
          'package.json',
        ));

        const { version } = generatedPackageJson;

        this.log(
          colors.italic(
            `Successfully generated ${colors.green(
              'react-vite-template',
            )} ${colors.yellow(version)}`,
          ),
        );
      });
  }
}
