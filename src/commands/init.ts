import { Args, Command, Flags, ux } from '@oclif/core';

import { allowedInitEntities, InitEntity } from '../types/InitEntity';
import { ChromeExtManifest } from '../types/ChromeExtManifest';

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

		switch (entityTypeArg) {
			case 'chrome-extension': {
				let manifest: ChromeExtManifest = {
					manifest_version: 3,
					name: '',
					description: '',
					version: '1.0.0',
					default_locale: 'en',
				};

				/** Prompt data from console. */
				manifest.name = (
					await ux.prompt('What is the name of extension?', {
						default: 'My react app',
					})
				)
					.replace(/\W/gi, '-')
					.toLowerCase();

				manifest.description = await ux.prompt(
					'Write description for your extension',
				);

				console.log(manifest);
			}
		}
	}
}
