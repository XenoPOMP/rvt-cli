import * as fs from 'fs';
import * as path from 'path';

export interface Configuration {
  componentGeneration?: {
    createScssModule?: boolean;
    createPropInterface?: boolean;
  };
}

/** CLI config. */
export const config: Configuration = (() => {
  /** Current working directory. */
  const PROJECT_DIR = process.cwd();

  /** Default configuration. */
  let defaultConfig: Configuration = {
    componentGeneration: {
      createScssModule: true,
      createPropInterface: true,
    },
  };

  /** Looking for config */
  if (fs.existsSync(path.join(PROJECT_DIR, 'rvt.cli.config.json'))) {
    const preloadedConfig = require(path.join(
      PROJECT_DIR,
      'rvt.cli.config.json',
    ));

    defaultConfig = { ...defaultConfig, ...preloadedConfig };
  }

  return defaultConfig;
})();
