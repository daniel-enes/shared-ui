import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-accessibility-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './accessibility-page.scss',
  templateUrl: './accessibility-page.html',
})
export class AccessibilityPage {}
