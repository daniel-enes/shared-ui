import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { ThemeService } from './theme.service';

describe('ThemeService OS preference reactivity', () => {

  let service: ThemeService;
  let mediaQueryMock: { matches: boolean; listeners: Array<() => void> };

  beforeEach(() => {
    mediaQueryMock = { matches: false, listeners: [] };

    // Define matchMedia diretamente no window (evita problemas com vi.spyOn)
    (window as any).matchMedia = () => ({
      addEventListener: (_type: string, listener: EventListener) => {
        mediaQueryMock.listeners.push(() => listener(new Event('change')));
      },
      removeEventListener: () => {},
      dispatchEvent: () => true,
      get matches() {
        return mediaQueryMock.matches;
      },
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: DOCUMENT,
          useValue: globalThis.document.implementation.createHTMLDocument('test'),
        },
      ],
    });

    service = TestBed.inject(ThemeService);

    localStorage.clear();
  });

  it('should update effective theme when OS preference changes while theme is system', () => {
    expect(service.theme()).toBe('system');
    expect(service.effectiveTheme()).toBe('light');

    mediaQueryMock.matches = true;

    mediaQueryMock.listeners.forEach((invoke) => invoke());

    expect(service.effectiveTheme()).toBe('dark');
  });

  it('should keep effective theme light when OS preference changes while theme is light', () => {
    service.setTheme('light');
    expect(service.effectiveTheme()).toBe('light');

    mediaQueryMock.matches = true;

    mediaQueryMock.listeners.forEach((invoke) => invoke());

    expect(service.effectiveTheme()).toBe('light');
  });

  it('should keep effective theme dark when OS preference changes while theme is dark', () => {
    service.setTheme('dark');
    expect(service.effectiveTheme()).toBe('dark');

    mediaQueryMock.matches = false;

    mediaQueryMock.listeners.forEach((invoke) => invoke());

    expect(service.effectiveTheme()).toBe('dark');
  });

});
