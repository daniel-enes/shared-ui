import { effect, inject, Injectable, signal, computed } from '@angular/core';

import { DOCUMENT } from '@angular/common';

export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'shared-ui-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  private readonly storedTheme = this.readStoredTheme();

  readonly theme = signal<Theme>(this.storedTheme ?? 'system');

  private readonly prefersColorSchemeSignal = signal<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'light'
  );

  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const current = this.theme();

    if (current === 'system') {
      return this.prefersColorSchemeSignal();
    }

    return current;
  });

  constructor() {

    effect(() => {
      const effective = this.effectiveTheme();
      this.document.documentElement.setAttribute('data-theme', effective);
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', () => {
        this.prefersColorSchemeSignal.set(
          mediaQuery.matches ? 'dark' : 'light'
        );
      });
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) {
          return;
        }

        if (event.newValue === null) {
          this.theme.set('system');
          return;
        }

        if (event.newValue === 'system' || event.newValue === 'light' || event.newValue === 'dark') {
          this.theme.set(event.newValue);
        }
      });
    }
  }

  private readStoredTheme(): Theme | null {

    if (typeof localStorage === 'undefined') {
      return null;
    }

    const value = localStorage.getItem(STORAGE_KEY);

    if (value === 'system' || value === 'light' || value === 'dark') {
      return value;
    }

    return null;
  }

  setTheme(value: Theme): void {

    this.theme.set(value);

    if (value !== 'system' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    } else if (value === 'system' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  toggleTheme(): void {

    const order: Theme[] = ['system', 'light', 'dark'];

    const currentIndex = order.indexOf(this.theme());

    const nextIndex = (currentIndex + 1) % order.length;

    this.setTheme(order[nextIndex]);
  }

  getAriaLabel(): string {

    const current = this.theme();

    const next: Record<Theme, string> = {
      system: 'Atual: sistema. Próximo: claro.',
      light: 'Atual: claro. Próximo: escuro.',
      dark: 'Atual: escuro. Próximo: sistema.',
    };

    return `Alternar tema. ${next[current]}`;
  }

}
