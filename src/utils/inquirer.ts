import input from '@inquirer/input';

export const inquirer: Record<'input', typeof input> = {
	input: (config, context) => input(config, context),
};
