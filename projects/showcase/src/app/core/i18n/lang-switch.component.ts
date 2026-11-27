import { Component, inject, signal } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-lang-switch',
  imports: [],
  standalone: true,
  styleUrl: './lang-switch.component.scss',
  templateUrl: './lang-switch.component.html',
})
export class LangSwitchComponent {

  private readonly transloco = inject(TranslocoService);

  readonly langs = ['en', 'pt-BR'];

  readonly activeLang = signal(this.transloco.getActiveLang());

  readonly isOpen = signal(false);

  setLang(lang: string): void {

    this.transloco.setActiveLang(lang);

    this.activeLang.set(lang);

    this.isOpen.set(false);
  }

  toggleMenu(): void {

    this.isOpen.update((value) => !value);
  }

  getLabel(lang: string): string {

    const labels: Record<string, string> = {
      en: 'English',
      'pt-BR': 'Português',
    };

    return labels[lang] ?? lang;
  }

}
