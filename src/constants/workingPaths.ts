import * as path from 'path';

const CWD = process.cwd();

export const WORKING_PATHS = {
  rvtLib: path.join(CWD, '.rvt'),
  localization: path.join(CWD, 'src/assets/localization'),
};
