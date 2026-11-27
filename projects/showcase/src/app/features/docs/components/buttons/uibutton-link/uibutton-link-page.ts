import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-uibutton-link-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './uibutton-link-page.scss',
  templateUrl: './uibutton-link-page.html',
})
export class UiButtonLinkPage {}
