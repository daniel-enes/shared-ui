import { effect, inject, Injectable, signal } from '@angular/core';

import { DOCUMENT } from '@angular/common';

export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'shared-ui-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  private readonly storedTheme = this.readStoredTheme();

  readonly theme = signal<Theme>(this.storedTheme ?? 'system');

  readonly effectiveTheme = signal<'light' | 'dark'>('light');

  readonly ariaLabel = signal(this.getAriaLabelText());

  constructor() {

    this.resolveEffectiveTheme();

    effect(() => {
      const current = this.theme();
      this.resolveEffectiveTheme();
      this.applyTheme();
      this.ariaLabel.set(this.getAriaLabelText());
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.resolveEffectiveTheme();
          this.applyTheme();
          this.ariaLabel.set(this.getAriaLabelText());
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

  private resolveEffectiveTheme(): void {

    const current = this.theme();

    if (current === 'system') {

      if (typeof window !== 'undefined' && window.matchMedia) {
        this.effectiveTheme.set(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } else {
        this.effectiveTheme.set('light');
      }

    } else {
      this.effectiveTheme.set(current);
    }
  }

  applyTheme(): void {

    const effective = this.effectiveTheme();

    this.document.documentElement.setAttribute('data-theme', effective);

    if (typeof localStorage !== 'undefined' && this.theme() !== 'system') {
      localStorage.setItem(STORAGE_KEY, this.theme());
    }
  }

  setTheme(value: Theme): void {

    this.theme.set(value);

    if (value === 'system') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      this.applyTheme();
    }
  }

  toggleTheme(): void {

    const order: Theme[] = ['system', 'light', 'dark'];

    const currentIndex = order.indexOf(this.theme());

    const nextIndex = (currentIndex + 1) % order.length;

    this.setTheme(order[nextIndex]);
  }

  private getAriaLabelText(): string {

    const current = this.theme();

    const next: Record<Theme, string> = {
      system: 'Atual: sistema. Próximo: claro.',
      light: 'Atual: claro. Próximo: escuro.',
      dark: 'Atual: escuro. Próximo: sistema.',
    };

    return `Alternar tema. ${next[current]}`;
  }

}
