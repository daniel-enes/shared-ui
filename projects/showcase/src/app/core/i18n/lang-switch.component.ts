import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
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

  private readonly router = inject(Router);

  readonly langs = ['en', 'pt-BR'];

  readonly activeLang = signal(this.transloco.getActiveLang());

  readonly isOpen = signal(false);

  setLang(lang: string): void {

    const currentUrl = this.router.url;

    const pathWithoutLang = currentUrl.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';

    this.router.navigateByUrl(`/${lang}${pathWithoutLang}`);

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
