import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';

import { colors } from '../utils/colors';
import { createEntity } from '../utils/createEntity';
import { createDir } from '../utils/createDir';

export default class CreateApp extends Command {
  static description = 'describe the command here';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    template: Flags.string({
      char: 't',
      description: 'choose template',
      required: false,
      options: ['redux', 'zustand'],
    }),
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
        tempDirectory: path.join(cwd, normalizedName, '_temp'),
      };
    })();

    /** Generate temp directories. */
    await Promise.all([createDir(PATHS.root), createDir(PATHS.tempDirectory)]);

    let exec = require('child_process').exec;
    const command = `git clone https://github.com/XenoPOMP/react-vite-template.git --branch=master "${PATHS.tempDirectory}"`;

    /** Delete temp folder. */
    // await Promise.all([deleteEntity(PATHS.tempDirectory)]);

    this.log(command);
  }
}
