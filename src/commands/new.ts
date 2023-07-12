import { Args, Command } from '@oclif/core';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';

import { checkForStructure } from '../utils/checkForStructure';
import { inlinePrefix } from '../utils/inlinePrefix';
import { colors } from '../utils/colors';
import { config } from '../types/Configuration';
import { fileExists } from '../utils/fileExists';
import { createFile } from '../utils/createFile';
import { IS_DEV } from '../constants/isDev';
import { inquirer } from '../utils/inquirer';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

const allowedGeneratingTypes: Record<string, string> = {
  component: 'create new component',
  ui: 'create new UI component',
  hook: 'create React hook',
};

export default class New extends Command {
  static description = 'Generate entity';

  static examples = [
    `<%= config.bin %> <%= command.id %> - generate new entity`,
  ];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const PROJECT_DIR = process.cwd();

    const { args, flags } = await this.parse(New);
    // const { type, name } = args;

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
      this.error('Project structure doesn`t match react-vite-template.');
    }

    /** Ask for details. */
    const type = await inquirer.select({
      message: 'Select generating entity type',
      choices: Object.keys(allowedGeneratingTypes).map(key => {
        return {
          name: capitalizeFirstLetter(key),
          value: key,
          description: capitalizeFirstLetter(allowedGeneratingTypes[key]),
        };
      }),
    });

    const name = await inquirer.input({
      message: 'Write name of entity',
    });

    /**
     * This function refactors name according
     * to correct template.
     */
    const getCorrectComponentName = (): string => {
      /** Name with correction. */
      const correctedName = name
        .split(/\W/gi)
        .map(capitalizeFirstLetter)
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

    const getCorrectHookName = (): ReturnType<
      typeof getCorrectComponentName
    > => {
      const convertedName = getCorrectComponentName();

      return `use${getCorrectComponentName()}`;
    };

    const { componentGeneration } = config;

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
        hook: path.join(cwd, 'src/assets/hooks', `${getCorrectHookName()}.ts`),
      };
    })();

    /** This function creates entity. */
    const createEntity = (path: string, content: string) => {
      fileExists(path)
        .then(() => {
          writeFile(path, content)
            .then(() => {
              this.log(inlinePrefix(path, 'update'));
            })
            .catch(this.error);
        })
        .catch(() => {
          createFile(path, content)
            .then(() => {
              this.log(inlinePrefix(path, 'create'));
            })
            .catch(this.error);
        });
    };

    /** This function creates components. */
    const createComponent = (
      type: keyof Pick<typeof generatingPaths, 'component' | 'ui'>,
    ) => {
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

      createEntity(generatingPaths[type].main, componentContent);

      /** Generate prop interface according to config. */
      if (config.componentGeneration?.createPropInterface) {
        createEntity(generatingPaths[type].props, componentInterfaceContent);
      }

      /** Generate stylesheet according to config. */
      if (config.componentGeneration?.createScssModule) {
        createEntity(generatingPaths[type].styles, '');
      }
    };

    /** This function creates hooks. */
    const createHook = () => {
      const hookContent = `export const ${name} = () => {};`;

      createEntity(generatingPaths.hook, hookContent);
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

      case 'hook': {
        createHook();
        break;
      }
    }
  }
}
