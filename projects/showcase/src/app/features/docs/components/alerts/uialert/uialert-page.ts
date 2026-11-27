import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-uialert-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './uialert-page.scss',
  templateUrl: './uialert-page.html',
})
export class UiAlertPage {}
