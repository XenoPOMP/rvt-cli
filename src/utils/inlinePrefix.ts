export const colors = require('cli-colors');

const prefixes: Record<
	string,
	{
		text: string;
		func: (text: string) => string;
	}
> = {
	missing: {
		text: 'missing',
		func: text => {
			return colors.red(text);
		},
	},

	warning: {
		text: 'warning',
		func: text => {
			return colors.yellow(text);
		},
	},
};

/**
 * Inline prefix to log message.
 *
 * @param str         message string.
 * @param prefix      prefix name ('missing' | 'warning').
 */
export const inlinePrefix = (
	str?: string,
	prefix?: 'missing' | 'warning',
): string => {
	/** Get selected prefix according to arguments. */
	const selectedPrefix = prefix !== undefined ? prefixes[prefix] : undefined;

	/** If prefix was selected, inline it. */
	if (selectedPrefix !== undefined) {
		const prefixNameList: string[] = Object.keys(prefixes).map(key => {
			return prefixes[key].text;
		});

		/** Calculate maximum prefix name length. */
		const largestNameLength: number = (() => {
			let maxLength = 0;

			prefixNameList.forEach(name => {
				if (name.length > maxLength) {
					maxLength = name.length;
				}
			});

			return maxLength;
		})();

		/** Generate additional spaces. */
		const additionalSpaces: string = (() => {
			if (selectedPrefix.text.length < largestNameLength) {
				return ' '.repeat(largestNameLength - selectedPrefix.text.length);
			}

			return '';
		})();

		return selectedPrefix.func(
			`${additionalSpaces} ${selectedPrefix.text} ${colors.white(str)}`,
		);
	}

	return `${str}`;
};
