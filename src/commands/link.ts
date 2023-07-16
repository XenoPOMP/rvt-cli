import { Args, Command, Flags } from '@oclif/core';

export default class Link extends Command {
  static description = 'describe the command here';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    file: Args.string({ description: 'file to read' }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Link);

    const name = flags.name ?? 'world';
    this.log(
      `hello ${name} from D:\\Repos\\TypeScript\\rvt-cli\\src\\commands\\link.ts`
    );
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
