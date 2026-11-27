import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {

  let service: ThemeService;

  beforeEach(() => {
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

  it('should initialize with system theme when nothing stored', () => {
    expect(service.theme()).toBe('system');
  });

  it('should initialize with stored light theme', () => {
    localStorage.setItem('shared-ui-theme', 'light');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: DOCUMENT,
          useValue: globalThis.document.implementation.createHTMLDocument('test'),
        },
      ],
    });

    const freshService = TestBed.inject(ThemeService);

    expect(freshService.theme()).toBe('light');
  });

  it('should set light theme and persist to localStorage', () => {
    service.setTheme('light');

    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('shared-ui-theme')).toBe('light');
  });

  it('should set system theme and remove from localStorage', () => {
    service.setTheme('light');
    expect(localStorage.getItem('shared-ui-theme')).toBe('light');

    service.setTheme('system');

    expect(service.theme()).toBe('system');
    expect(localStorage.getItem('shared-ui-theme')).toBeNull();
  });

  it('should sync system theme between tabs via storage event with null newValue', () => {
    service.setTheme('light');

    const storageEvent = new StorageEvent('storage', {
      key: 'shared-ui-theme',
      newValue: null,
      oldValue: 'light',
    });

    window.dispatchEvent(storageEvent);

    expect(service.theme()).toBe('system');
  });

  it('should sync light theme between tabs via storage event', () => {
    service.setTheme('system');

    const storageEvent = new StorageEvent('storage', {
      key: 'shared-ui-theme',
      newValue: 'light',
      oldValue: null,
    });

    window.dispatchEvent(storageEvent);

    expect(service.theme()).toBe('light');
  });

  it('should ignore storage events for other keys', () => {
    const storageEvent = new StorageEvent('storage', {
      key: 'other-key',
      newValue: 'light',
      oldValue: 'dark',
    });

    window.dispatchEvent(storageEvent);

    expect(service.theme()).toBe('system');
  });

  it('should ignore storage events with invalid values', () => {
    const storageEvent = new StorageEvent('storage', {
      key: 'shared-ui-theme',
      newValue: 'invalid',
      oldValue: 'light',
    });

    window.dispatchEvent(storageEvent);

    expect(service.theme()).toBe('system');
  });

  it('should toggle through system -> light -> dark -> system', () => {
    expect(service.theme()).toBe('system');

    service.toggleTheme();
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('system');
  });

  it('should return dynamic aria label for each theme', () => {
    service.setTheme('system');
    expect(service.getAriaLabel()).toContain('sistema');
    expect(service.getAriaLabel()).toContain('claro');

    service.setTheme('light');
    expect(service.getAriaLabel()).toContain('claro');
    expect(service.getAriaLabel()).toContain('escuro');

    service.setTheme('dark');
    expect(service.getAriaLabel()).toContain('escuro');
    expect(service.getAriaLabel()).toContain('sistema');
  });

});
