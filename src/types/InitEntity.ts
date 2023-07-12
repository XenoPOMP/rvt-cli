export const allowedInitEntities = {
  'chrome-extension': '',
};

export type InitEntity = keyof typeof allowedInitEntities;
