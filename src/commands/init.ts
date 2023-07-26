import { Args, Command } from '@oclif/core';
import * as path from 'path';
import * as shell from 'shelljs';

import { IS_DEV } from '../constants/isDev';
import { WORKING_PATHS } from '../constants/workingPaths';
import { ChromeExtManifest, Permissions } from '../types/ChromeExtManifest';
import { InitEntity, allowedInitEntities } from '../types/InitEntity';
import { colors } from '../utils/colors';
import { FileSystemManager } from '../utils/file-system-manager';
import { inlinePrefix } from '../utils/inlinePrefix';
import { inquirer } from '../utils/inquirer';
import { rm, writeFile } from 'fs/promises';

export default class Init extends Command {
  static description =
    'initialize some specific project types (Chrome ext. etc.)';

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

    const fsManager = new FileSystemManager();

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
        const relativePathToManifest = '.rvt\\manifests\\chrome\\manifest.json';
        const pathToManifest = path.join(PROJECT_DIR, relativePathToManifest);
        /** Path to manifest`s icons source. */
        const pathToImages = path.join(pathToManifest, '../');
        /** Import package json. */
        const packageJson = require(path.join(PROJECT_DIR, './package.json'));

        /** Re-define scripts. */
        /** Dev script. */
        packageJson.scripts[
          'dev'
        ] = `concurrently \"vite\" \"yarn watch:metadata\"`;
        /** Build script. */
        packageJson.scripts['build'] = 'tsc && vite build && yarn afterbuild';
        /** Link project locales, version etc. */
        packageJson.scripts['link:project'] =
          'concurrently ' +
          ['rvt link locales', 'rvt link version']
            .map(command => `\"${command}\"`)
            .join(' ');
        /** After-build script. */
        packageJson.scripts[
          'afterbuild'
        ] = `yarn link:project && xcopy /s /v /y \\".rvt\\\\manifests\\\\chrome\\\\*\\" \"dist\"`;
        /** Watch metadata script. */
        packageJson.scripts[
          'watch:metadata'
        ] = `nodemon --exec \"yarn afterbuild\" --watch src --ext \"ts\"`;

        /** Confirmation. */
        const confirm: boolean = await inquirer.confirm({
          message: `Confirm ${colors.green(
            `${manifest.name}@${manifest.version}`
          )}?`,
        });
        /** Close CLI if not confirmed. */
        if (!confirm) {
          this.exit(1);
        }

        const localizationPaths = {
          source: path.join(__dirname, 'resources/localization'),
          destination: WORKING_PATHS.localization,
        };

        /** Dev mode code. */
        if (IS_DEV) {
          console.log({
            manifest,
            packageJson,
            localizationPaths,
          });
        } /** Non-dev code. Writing files. */ else {
          /** Update package json. Add new scripts. */
          writeFile(
            path.join(PROJECT_DIR, './package.json'),
            JSON.stringify(packageJson, null, 2)
          )
            .then(() => this.log(inlinePrefix('package.json', 'update')))
            .catch(err => this.error(err));

          /** Create or update manifest file. */
          fsManager
            .fileExists(pathToManifest)
            .then(() =>
              writeFile(pathToManifest, JSON.stringify(manifest, null, 2))
                .then(() =>
                  this.log(inlinePrefix(`${pathToManifest}`, 'update'))
                )
                .catch(err => this.error(err))
            )
            .catch(() =>
              fsManager
                .createFile(pathToManifest, JSON.stringify(manifest, null, 2))
                .then(() =>
                  this.log(inlinePrefix(`${pathToManifest}`, 'create'))
                )
                .catch(err => this.error(err))
            );

          /** Copy localization. */
          rm(localizationPaths.destination, {
            recursive: true,
            force: true,
          })
            .catch(reason => {
              this.error(`Failed to delete directory (${reason})`);
            })
            .finally(() => {
              shell.exec(
                `copy \"${localizationPaths.source}\" \"${path.join(
                  localizationPaths.destination,
                  '../'
                )}\"`
              );
            });

          /** Install additional deps. */
          shell.exec(
            'yarn add ' + ['concurrently', 'nodemon', 'shx'].join(' ') + ' -D'
          );
        }
      }
    }
  }
}
