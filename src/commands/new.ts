import { Args, Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';

import { checkForStructure } from '../utils/checkForStructure';
import { inlinePrefix } from '../utils/inlinePrefix';
import { colors } from '../utils/colors';
import { Configuration, config } from '../types/Configuration';
import { fileExists } from '../utils/fileExists';

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

		const { componentGeneration } = config;

		/** Content of generated component. */
		const componentContent: string = [
			"import cn from 'classnames';",
			"import { FC } from 'react';",
			' ',
			componentGeneration?.createScssModule
				? `import styles from './${getCorrectComponentName()}.module.scss';`
				: '',
			componentGeneration?.createPropInterface
				? `import type { ${getCorrectComponentName()}Props } from './${getCorrectComponentName()}.props';`
				: '',
			' ',
			`const ${getCorrectComponentName()}: FC<${
				componentGeneration?.createPropInterface
					? `${getCorrectComponentName()}Props`
					: '{}'
			}> = ({}) => {`,
			'\t' + `return <div></div>;`,
			'};',
			' ',
			`export default ${getCorrectComponentName()};`,
		]
			.join('\n')
			.replace(/\n{2,}/gi, '\n');

		/** Component`s prop interface content. */
		const componentInterfaceContent = `export interface ${getCorrectComponentName()}Props {};`;

		/** Paths of generating files. */
		const generatingPaths = ((
			cwd = PROJECT_DIR,
			name = getCorrectComponentName(),
		) => {
			return {
				component: {
					main: path.join(cwd, 'src/assets/components', `${name}/${name}.tsx`),

					styles: path.join(
						cwd,
						'src/assets/components',
						`${name}/${name}.module.scss`,
					),

					props: path.join(
						cwd,
						'src/assets/components',
						`${name}/${name}.props.ts`,
					),
				},
				ui: {
					main: path.join(
						cwd,
						'src/assets/components/ui',
						`${name}/${name}.tsx`,
					),

					styles: path.join(
						cwd,
						'src/assets/components/ui',
						`${name}/${name}.module.scss`,
					),

					props: path.join(
						cwd,
						'src/assets/components/ui',
						`${name}/${name}.props.ts`,
					),
				},
			};
		})();

		/** This function creates files. */
		const createFile = require('create-file');

		/** This function creates components. */
		const createComponent = (
			type: keyof Pick<typeof generatingPaths, 'component' | 'ui'>,
		) => {
			/** Generating main file. */
			fileExists(generatingPaths[type].main)
				.then(() => {
					fs.writeFile(generatingPaths[type].main, componentContent, err => {
						if (err) {
							this.error(err);
						}

						this.log(inlinePrefix(generatingPaths[type].main, 'update'));
					});
				})
				.catch(() => {
					createFile(
						generatingPaths[type].main,
						componentContent,
						(err: any) => {
							if (err) {
								this.error(err);
							}

							this.log(inlinePrefix(generatingPaths[type].main, 'create'));
						},
					);
				});

			/** Generate prop interface according to config. */
			if (config.componentGeneration?.createPropInterface) {
				fileExists(generatingPaths[type].props)
					.then(() => {
						fs.writeFile(
							generatingPaths[type].props,
							componentInterfaceContent,
							err => {
								if (err) {
									this.error(err);
								}

								this.log(inlinePrefix(generatingPaths[type].props, 'update'));
							},
						);
					})
					.catch(() => {
						createFile(
							generatingPaths[type].props,
							componentInterfaceContent,
							(err: any) => {
								if (err) {
									this.error(err);
								}

								this.log(inlinePrefix(generatingPaths[type].props, 'create'));
							},
						);
					});
			}

			/** Generate stylesheet according to config. */
			if (config.componentGeneration?.createScssModule) {
				fileExists(generatingPaths[type].styles)
					.then(() => {
						fs.writeFile(generatingPaths[type].styles, '', err => {
							if (err) {
								this.error(err);
							}

							this.log(inlinePrefix(generatingPaths[type].styles, 'update'));
						});
					})
					.catch(() => {
						createFile(generatingPaths[type].styles, '', (err: any) => {
							if (err) {
								this.error(err);
							}

							this.log(inlinePrefix(generatingPaths[type].styles, 'create'));
						});
					});
			}
		};

		switch (type) {
			case 'component': {
				createComponent('component');
				break;
			}

			case 'ui': {
				createComponent('ui');
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
