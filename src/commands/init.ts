import { Args, Command, Flags, ux } from '@oclif/core';
import * as path from 'path';
import { writeFile } from 'fs/promises';

import { allowedInitEntities, InitEntity } from '../types/InitEntity';
import { ChromeExtManifest } from '../types/ChromeExtManifest';
import { fileExists } from '../utils/fileExists';
import { inlinePrefix } from '../utils/inlinePrefix';
import { createFile } from '../utils/createFile';
import { colors } from '../utils/colors';
import * as fs from 'fs';

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
				};

				/**
				 * Log to inform user that
				 * utility started to work.
				 */
				this.log(colors.green('Chrome extension generation utility.'));

				/** Prompt data from console. */
				manifest.name = (
					await ux.prompt('Name', {
						default: (() => {
							let name = '';

							fileExists(
								path.join(
									PROJECT_DIR,
									'src/assets',
									'redux/reducers/appSettings.slice.ts',
								),
							)
								.then(() => {
									fs.readFile(
										path.join(
											PROJECT_DIR,
											'src/assets',
											'redux/reducers/appSettings.slice.ts',
										),
										{},
										(err, data) => {
											if (!err) {
												name = data
													.toString()
													.split(/(appName: '.*')/gi)
													.filter(item => /appName: '.*'/gi.test(item))[0]
													.replace(/((^appName: ')|('$))/gi, '');
											}
										},
									);
								})
								.catch(() => {});

							return name;
						})(),
					})
				)
					.replace(/\W/gi, '-')
					.toLowerCase();

				manifest.description = await ux.prompt('Description', {
					required: false,
				});

				manifest.version = await ux.prompt('Version', {
					default: manifest.version,
					required: false,
				});

				/** Path to generated manifest file. */
				const pathToManifest = path.join(
					PROJECT_DIR,
					'src/manifests/chrome/manifest.json',
				);

				console.log(manifest);

				/** Create or update manifest file. */
				// fileExists(pathToManifest)
				// 	.then(() =>
				// 		writeFile(pathToManifest, JSON.stringify(manifest))
				// 			.then(() => this.log(inlinePrefix(`${pathToManifest}`, 'update')))
				// 			.catch(err => this.error(err)),
				// 	)
				// 	.catch(() =>
				// 		createFile(pathToManifest, JSON.stringify(manifest))
				// 			.then(() => this.log(inlinePrefix(`${pathToManifest}`, 'create')))
				// 			.catch(err => this.error(err)),
				// 	);
			}
		}
	}
}
