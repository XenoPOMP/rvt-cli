import * as fs from 'fs';
import * as path from 'path';

/**
 * This function checks current working directory
 * if it`s react-vite-template project folder.
 *
 * @param {string} cwd           current working directory path.
 *
 * @return {boolean}             true if structure is correct.
 */
export const checkForStructure = (
	cwd: string,
): {
	correct: boolean;
	missing?: string[];
} => {
	/** List of entities that have to be checked. */
	const checkingEntities: string[] = [
		'public',
		// Source folders
		'src',
		// Asset folders
		'src/assets',
		'src/assets/components',
		'src/assets/components/ui',
		'src/assets/hooks',
		'src/assets/pages',
		'src/assets/providers',
		'src/assets/redux',
		'src/assets/styles',

		'src/media',
	];

	return {
		correct: !checkingEntities
			.map<boolean>(ent => fs.existsSync(path.join(cwd, ent)))
			.includes(false),

		missing: checkingEntities
			.map<string>(ent => {
				if (!fs.existsSync(path.join(cwd, ent))) {
					return ent;
				}

				return '[NOT_MISSING]';
			})
			.filter(ent => ent !== '[NOT_MISSING]'),
	};
};
