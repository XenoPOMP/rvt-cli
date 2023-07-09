import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';
import { writeFile } from 'fs/promises';

import { allowedInitEntities, InitEntity } from '../types/InitEntity';
import {
	ChromeExtManifest,
	Permission,
	Permissions,
} from '../types/ChromeExtManifest';
import { fileExists } from '../utils/fileExists';
import { inlinePrefix } from '../utils/inlinePrefix';
import { createFile } from '../utils/createFile';
import { colors } from '../utils/colors';
import * as fs from 'fs';
import { IS_DEV } from '../constants/isDev';
import { inquirer } from '../utils/inquirer';

export default class Init extends Command {
	static description = 'describe the command here';

	static examples = [
		'<%= config.bin %> <%= command.id %> ENTITY - init certain entity.',
	];

	static flags = {};

	static args = {
		entity: Args.string({
			description: 'Initializing entity.',
			required: true,
			options: Object.keys(allowedInitEntities),
		}),
	};

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(Init);

		const entityTypeArg: InitEntity = args.entity as InitEntity;

		const PROJECT_DIR = process.cwd();

		switch (entityTypeArg) {
			case 'chrome-extension': {
				let manifest: ChromeExtManifest = {
					manifest_version: 3,
					name: '',
					description: '',
					version: '1.0.0',
					default_locale: 'en',
					action: {
						default_popup: 'index.html',
					},
				};

				/**
				 * Log to inform user that
				 * utility started to work.
				 */
				this.log(colors.green('Chrome extension generation utility.'));

				/** Prompt name from console. */
				manifest.name = await inquirer.input({
					message: 'Enter name:',
					default: 'my-chrome-extension',
					transformer: (input, { isFinal }) => {
						return isFinal ? input.replace(/\W/gi, '-').toLowerCase() : input;
					},
				});

				/** Prompt desc from console. */
				manifest.description = await inquirer.input({
					message: 'Enter description:',
				});

				/** Prompt version from console. */
				manifest.version = await inquirer.input({
					message: 'Enter version:',
					default: '0.0.0',
					validate: input => {
						return /^(\d)(\.?\d\.?)+/gi.test(input);
					},
				});

				/** Select preset from list. */
				const presetSelect = await inquirer.select<Permissions>({
					message: 'Select permission preset:',
					choices: [
						{
							name: 'Focus Mode',
							value: {
								permissions: ['scripting', 'activeTab'],
								optional_permissions: [],
								host_permissions: [],
								optional_host_permissions: [],
							},
							description:
								"Enable reading mode on Chrome's official Extensions and Chrome Web Store documentation.",
						},

						{
							name: 'Tabs Manager',
							value: {
								permissions: ['tabGroups'],
								optional_permissions: [],
								host_permissions: [],
								optional_host_permissions: [],
							},
							description:
								'Organizes your Chrome extension and Chrome Web store documentation tabs.',
						},

						{
							name: 'None',
							value: {
								permissions: [],
								optional_permissions: [],
								host_permissions: [],
								optional_host_permissions: [],
							},
							description: 'No additional permissions.',
						},
					],
				});
				/** Spread preset into manifest. */
				manifest = { ...manifest, ...presetSelect };

				/** Path to generated manifest file. */
				const pathToManifest = path.join(
					PROJECT_DIR,
					'.rvt/manifests/chrome/manifest.json',
				);
				/** Path to manifest`s icons source. */
				const pathToImages = path.join(pathToManifest, '../');
				/** Import package json. */
				const packageJson = require(path.join(PROJECT_DIR, './package.json'));

				/** Re-define scripts. */
				packageJson.scripts['build'] = 'tsc && vite build && yarn afterbuild';
				packageJson.scripts['afterbuild'] = `copy ${pathToManifest} dist`;

				/** Confirmation. */
				const confirm: boolean = await inquirer.confirm({
					message: `Confirm ${colors.green(
						`${manifest.name}@${manifest.version}`,
					)}?`,
				});
				/** Close CLI if not confirmed. */
				if (!confirm) {
					this.exit(1);
				}

				/** Dev mode code. */
				if (IS_DEV) {
					console.log(manifest);
				} /** Non-dev code. Writing files. */ else {
					/** Update package json. Add new scripts. */
					writeFile(
						path.join(PROJECT_DIR, './package.json'),
						JSON.stringify(packageJson, null, 2),
					)
						.then(() => this.log(inlinePrefix('package.json', 'update')))
						.catch(err => this.error(err));

					/** Create or update manifest file. */
					fileExists(pathToManifest)
						.then(() =>
							writeFile(pathToManifest, JSON.stringify(manifest, null, 2))
								.then(() =>
									this.log(inlinePrefix(`${pathToManifest}`, 'update')),
								)
								.catch(err => this.error(err)),
						)
						.catch(() =>
							createFile(pathToManifest, JSON.stringify(manifest, null, 2))
								.then(() =>
									this.log(inlinePrefix(`${pathToManifest}`, 'create')),
								)
								.catch(err => this.error(err)),
						);
				}
			}
		}
	}
}
