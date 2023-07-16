import checkbox from '@inquirer/checkbox';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';
import password from '@inquirer/password';
import select from '@inquirer/select';

interface Inquirer {
  /**
   * Inquirer input function. See [docs here](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/input)
   */
  input: typeof input;

  /**
   * Inquirer checkbox function. See [docs here](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/checkbox)
   */
  checkbox: typeof checkbox;

  /**
   * Inquirer select function. See [docs here](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/select)
   */
  select: typeof select;

  /**
   * Inquirer confirm function. See [docs here](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/confirm)
   */
  confirm: typeof confirm;

  /**
   * Inquirer password function. See [docs here](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/password)
   */
  password: typeof password;
}

export const inquirer: Inquirer = {
  input: (config, context) => input(config, context),
  checkbox: (config, context) => checkbox(config, context),
  select: (config, context) => select(config, context),
  confirm: (config, context) => confirm(config, context),
  password: (config, context) => password(config, context),
};
