import { Args, Command, Flags } from '@oclif/core';

import { checkForStructure } from '../utils/checkForStructure';
import { inlinePrefix } from '../utils/inlinePrefix';

export default class New extends Command {
	static description = 'Generate entity';

	static examples = [
		'<%= config.bin %> <%= command.id %> component - create new component',
		// '<%= config.bin %> <%= command.id %> ui - create new UI component',
	];

	static flags = {
		// // flag with a value (-n, --name=VALUE)
		// name: Flags.string({char: 'n', description: 'name to print'}),
		// // flag with no value (-f, --force)
		// force: Flags.boolean({char: 'f'}),
	};

	static args = {
		type: Args.string({
			description: 'Type of generating entity',
			required: true,
		}),

		name: Args.string({
			description: 'Newborn entity name',
			required: true,
		}),
	};

	public async run(): Promise<void> {
		const PROJECT_DIR = process.cwd();

		const { args, flags } = await this.parse(New);
		const { type, name } = args;

		/** Checking for correct structure. */
		const correctChecking: ReturnType<typeof checkForStructure> =
			checkForStructure(PROJECT_DIR);

		if (!correctChecking.correct) {
			this.log('Missing entities:');

			correctChecking.missing?.forEach(missingEntity => {
				this.log(inlinePrefix(missingEntity, 'missing'));
			});

			this.error('Project structure doesn`t match react-vite-template.');
		}

		switch (type) {
			case 'component': {
				this.log(`Trying to create component ${name}.`);
				break;
			}

			default: {
				this.error(
					`Type ${type} is not allowed. Use rvt --help new to see instructions for command.`,
				);
			}
		}
	}
}
