import { Args, Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';

import { checkForStructure } from '../utils/checkForStructure';
import { inlinePrefix } from '../utils/inlinePrefix';
import { colors } from '../utils/colors';
import { Configuration, config } from '../types/Configuration';

export default class New extends Command {
	static description = 'Generate entity';

	static examples = [
		'<%= config.bin %> <%= command.id %> component NAME - create new component',
		'<%= config.bin %> <%= command.id %> ui NAME - create new UI component',
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

		/** CLI config. */
		// let config: Config = defaultConfig;

		/** Checking for correct structure. */
		const correctChecking: ReturnType<typeof checkForStructure> =
			checkForStructure(PROJECT_DIR);

		/** If directory structure is not correct, write missing entities. */
		if (!correctChecking.correct) {
			this.log('Missing entities:');

			/** Write each missing entity. */
			correctChecking.missing?.forEach(missingEntity => {
				this.log(inlinePrefix(missingEntity, 'missing'));
			});

			/** Final error message. */
			// this.error('Project structure doesn`t match react-vite-template.');
		}

		/**
		 * This function refactors name according
		 * to correct template.
		 */
		const getCorrectComponentName = (): string => {
			/** Name with correction. */
			const correctedName = name
				.split(/\W/gi)
				.map(
					part => `${part.at(0)?.toUpperCase()}${part.slice(1, part.length)}`,
				)
				.join('');

			/** Wrong pattern provided. */
			if (!/^([A-Z][a-z]*)+$/.test(name)) {
				const warningMessage = `Name doesn\`t satisfy template (${colors.italic(
					`${correctedName}`,
				)} expected, but ${colors.italic(
					name,
				)} provided). Formatted variant will be used.`;

				this.log(inlinePrefix(warningMessage, 'warning'));
			}

			return correctedName;
		};

		switch (type) {
			case 'component': {
				this.log(
					`Trying to create component ${colors.italic(
						getCorrectComponentName(),
					)}.`,
				);
				break;
			}

			case 'ui': {
				this.log(
					`Trying to create UI component ${colors.italic(
						getCorrectComponentName(),
					)}.`,
				);
				break;
			}

			default: {
				this.error(
					`Type ${colors.italic(type)} is not allowed. Use ${colors.bgGreen(
						'rvt --help new',
					)} to see instructions for command.`,
				);
			}
		}
	}
}
