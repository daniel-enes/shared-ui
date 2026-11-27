import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ThemeService } from './core/theme/theme.service';
import { LangSyncService } from './core/i18n/lang-sync.service';
import { provideTransloco } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './core/i18n/transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ThemeService,
    LangSyncService,
    HttpClient,
    provideTransloco({
      config: {
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
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
