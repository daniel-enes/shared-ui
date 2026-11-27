import { Component, inject, input } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-translated-notice',
  imports: [RouterLink],
  standalone: true,
  styleUrl: './not-translated-notice.component.scss',
  templateUrl: './not-translated-notice.component.html',
})
export class NotTranslatedNoticeComponent {

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly availableLang = input.required<string>();

  readonly availableLangLabel = input.required<string>();

  linkForAvailableLang(): string {

    const currentUrl = this.router.url;

    const pathWithoutLang = currentUrl.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';

    return `/${this.availableLang()}${pathWithoutLang}`;
  }

}
