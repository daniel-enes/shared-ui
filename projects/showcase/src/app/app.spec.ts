import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

import { provideTransloco } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
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
        }),
        HttpClient,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render docs layout component', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-docs-layout')).toBeTruthy();
  });
});
