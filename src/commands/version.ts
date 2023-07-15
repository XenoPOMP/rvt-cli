import { Args, Command, Flags } from '@oclif/core';

import { colors } from '../utils/colors';

export default class Version extends Command {
  static description = 'display installed version of CLI';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Version);

    const packageJsonFile = require('../../package.json');

    this.log(
      `${colors.gray('Current installed version of rvt-cli: ')}${colors.green(
        packageJsonFile.version,
      )}`,
    );
  }
}
