import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-uibutton-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './uibutton-page.scss',
  templateUrl: './uibutton-page.html',
})
export class UiButtonPage {}
