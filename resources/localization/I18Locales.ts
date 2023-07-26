import { isUndefined } from '@utils/type-checks';

type LocalizationMessage = {
  message: string;
  description: string;
};

export interface I18Locales extends Record<'localeName', LocalizationMessage> {}

export type Localization = {
  [K in keyof I18Locales]: string;
};

export const getChromeLocale = (message: keyof I18Locales): string => {
  return isUndefined(chrome.i18n?.getMessage(message))
    ? `[${message
        .split(/([A-Z][a-z]*)/g)
        .map(word => word.toUpperCase())
        .join(' ')
        .replace(/(\s{2,})/gi, '_')
        .replace(/(\s$)/gi, '')}]`
    : chrome?.i18n?.getMessage(message);
};
