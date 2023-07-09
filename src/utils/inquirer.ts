import input from '@inquirer/input';

export const inquirer: { input: typeof input } = {
	input: (config, context) => input(config, context),
};
