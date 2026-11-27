import { TranslocoConfig } from '@jsverse/transloco';

export const translocoConfig: TranslocoConfig = {

  availableLangs: ['en', 'pt-BR'],

  defaultLang: 'en',

  fallbackLang: 'en',

  missingHandler: {
    logMissingKey: false,
    useFallbackTranslation: true,
    allowEmpty: false,
  },

  reRenderOnLangChange: true,

  prodMode: false,

  failedRetries: 0,

  flatten: { aot: false },

  interpolation: ['{{', '}}'],

  scopes: {},

};
