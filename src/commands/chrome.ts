import { Choice } from '@inquirer/checkbox';
import { Args, Command, Flags } from '@oclif/core';
import * as path from 'path';

import { WORKING_PATHS } from '../constants/workingPaths';
import { ArrayType } from '../types/ArrayType';
import { ChromeExtManifest, Permissions } from '../types/ChromeExtManifest';
import { Value } from '../types/Value';
import { FileSystemManager } from '../utils/file-system-manager';
import { inquirer } from '../utils/inquirer';

export default class Chrome extends Command {
  static description = 'manage Chrome`s extension';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    permission: Flags.string({
      char: 'p',
      description: 'Select type of permission to add',
      required: false,
      default: 'main',
      options: ['main', 'optional', 'host'],
    }),
  };

  static args = {
    action: Args.string({
      required: true,
      options: ['manage'],
    }),

    target: Args.string({
      required: true,
      options: ['permission'],
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Chrome);
    const { action, target } = args;
    const { permission } = flags;

    const fsManager = new FileSystemManager();

    const PATHS = {
      manifest: path.join(
        WORKING_PATHS.rvtLib,
        'manifests/chrome/manifest.json'
      ),
    };

    switch (action) {
      case 'manage': {
        const allowedAdditionList = ['permission'];
        let permissionGroupName: keyof Permissions = 'permissions';

        switch (permission) {
          case 'main': {
            permissionGroupName = 'permissions';
            break;
          }

          case 'optional': {
            permissionGroupName = 'optional_permissions';
            break;
          }

          case 'host': {
            permissionGroupName = 'host_permissions';
            break;
          }
        }

        if (!allowedAdditionList.includes(target)) {
          this.error(
            `Can not add ${target}, use [${allowedAdditionList.join('|')}]`
          );
        }

        const manifest: ChromeExtManifest = require(PATHS.manifest);

        const getChoices = (): Choice<ArrayType<Value<Permissions>>>[] => {
          const wrapChoice = (
            name: ArrayType<ReturnType<typeof getChoices>>['value']
          ): ArrayType<ReturnType<typeof getChoices>> => {
            return {
              name: name,
              value: name,
              checked: manifest[permissionGroupName]?.includes(name),
            };
          };

          return [
            wrapChoice('activeTab'),
            wrapChoice('alarms'),
            wrapChoice('background'),
            wrapChoice('bookmarks'),
            wrapChoice('browsingData'),
            wrapChoice('certificateProvider'),
            wrapChoice('clipboardRead'),
            wrapChoice('clipboardWrite'),
            wrapChoice('contentSettings'),
            wrapChoice('contextMenus'),
            wrapChoice('cookies'),
            wrapChoice('debugger'),
            wrapChoice('declarativeContent'),
            wrapChoice('declarativeNetRequest'),
            wrapChoice('declarativeNetRequestWithHostAccess'),
            wrapChoice('declarativeNetRequestFeedback'),
            wrapChoice('declarativeWebRequest'),
            wrapChoice('desktopCapture'),
            wrapChoice('documentScan'),
            wrapChoice('downloads'),
            wrapChoice('enterprise.deviceAttributes'),
            wrapChoice('enterprise.hardwarePlatform'),
            wrapChoice('enterprise.networkingAttributes'),
            wrapChoice('enterprise.platformKeys'),
            wrapChoice('experimental'),
            wrapChoice('fileBrowserHandler'),
            wrapChoice('fileSystemProvider'),
            wrapChoice('fontSettings'),
            wrapChoice('gcm'),
            wrapChoice('geolocation'),
            wrapChoice('history'),
            wrapChoice('identity'),
            wrapChoice('idle'),
            wrapChoice('loginState'),
            wrapChoice('management'),
            wrapChoice('nativeMessaging'),
            wrapChoice('notifications'),
            wrapChoice('offscreen'),
            wrapChoice('pageCapture'),
            wrapChoice('platformKeys'),
            wrapChoice('power'),
            wrapChoice('printerProvider'),
            wrapChoice('printing'),
            wrapChoice('printingMetrics'),
            wrapChoice('privacy'),
            wrapChoice('processes'),
            wrapChoice('proxy'),
            wrapChoice('scripting'),
            wrapChoice('search'),
            wrapChoice('sessions'),
            wrapChoice('sidePanel'),
            wrapChoice('storage'),
            wrapChoice('system.cpu'),
            wrapChoice('system.display'),
            wrapChoice('system.memory'),
            wrapChoice('system.storage'),
            wrapChoice('tabCapture'),
            wrapChoice('tabGroups'),
            wrapChoice('tabs'),
            wrapChoice('topSites'),
            wrapChoice('tts'),
            wrapChoice('ttsEngine'),
            wrapChoice('unlimitedStorage'),
            wrapChoice('vpnProvider'),
            wrapChoice('wallpaper'),
            wrapChoice('webAuthenticationProxy'),
            wrapChoice('webNavigation'),
            wrapChoice('webRequest'),
            wrapChoice('webRequestBlocking'),
          ];
        };

        inquirer
          .checkbox<ArrayType<Value<Permissions>>>({
            message: 'Select permissions:',
            choices: [...getChoices()],
          })
          .then(res => {
            manifest[permissionGroupName] = res;

            fsManager.createEntity(PATHS.manifest, manifest, {
              commandInstance: this,
            });
          });

        break;
      }
    }
  }
}
