type Modifier =
  | 'bold'
  | 'hidden'
  | 'inverse'
  | 'italic'
  | 'strikethrough'
  | 'underline';

type Color =
  | 'black'
  | 'blue'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'grey'
  | 'magenta'
  | 'red'
  | 'yellow'
  | 'white';

type Background =
  | 'bgBlack'
  | 'bgBlue'
  | 'bgCyan'
  | 'bgGreen'
  | 'bgMagenta'
  | 'bgRed'
  | 'bgYellow'
  | 'bgWhite';

type Special = 'reset' | 'styles';

type Painting = Color | Modifier | Background | Special;

const cliColors = require('cli-colors');

/**
 * Function that adds color styling to text.
 *
 * @example
 * colors.white(str)
 */
export const colors: Record<Painting, (text?: string) => string> = {
  // Modifiers
  bold: text => cliColors.bold(text),
  hidden: text => cliColors.hidden(text),
  inverse: text => cliColors.inverse(text),
  italic: text => cliColors.italic(text),
  strikethrough: text => cliColors.strikethrough(text),
  underline: text => cliColors.underline(text),

  // Colors
  black: text => cliColors.black(text),
  blue: text => cliColors.blue(text),
  cyan: text => cliColors.cyan(text),
  gray: text => cliColors.gray(text),
  green: text => cliColors.green(text),
  grey: text => cliColors.grey(text),
  magenta: text => cliColors.magenta(text),
  red: text => cliColors.red(text),
  yellow: text => cliColors.yellow(text),
  white: text => cliColors.white(text),

  // Backgrounds
  bgBlack: text => cliColors.bgBlack(text),
  bgBlue: text => cliColors.bgBlue(text),
  bgCyan: text => cliColors.bgCyan(text),
  bgGreen: text => cliColors.bgGreen(text),
  bgMagenta: text => cliColors.bgMagenta(text),
  bgRed: text => cliColors.bgRed(text),
  bgYellow: text => cliColors.bgYellow(text),
  bgWhite: text => cliColors.bgWhite(text),

  // Special
  reset: text => cliColors.reset(text),
  styles: text => cliColors.styles(text),
};
