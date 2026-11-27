import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-introduction-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './introduction-page.scss',
  templateUrl: './introduction-page.html',
})
export class IntroductionPage {}
