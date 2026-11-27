import { TranslocoLoader, TranslocoModule } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {

  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string) {

    return this.http.get<Record<string, unknown>>(`assets/i18n/${lang}.json`);
  }

}
