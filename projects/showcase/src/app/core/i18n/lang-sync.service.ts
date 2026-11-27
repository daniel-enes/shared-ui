import { inject, Injectable } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LangSyncService {

  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  constructor() {

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      const lang = this.extractLangFromUrl(this.router.url);

      if (lang && lang !== this.transloco.getActiveLang()) {
        this.transloco.setActiveLang(lang);
        this.updateDocumentLang(lang);
      }
    });

    const initialLang = this.extractLangFromUrl(this.router.url);

    if (initialLang) {
      this.transloco.setActiveLang(initialLang);
      this.updateDocumentLang(initialLang);
    }
  }

  private extractLangFromUrl(url: string): string | null {

    const match = url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);

    return match ? match[1] : null;
  }

  private updateDocumentLang(lang: string): void {

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

}
