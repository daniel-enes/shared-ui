import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-configuration-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './configuration-page.scss',
  templateUrl: './configuration-page.html',
})
export class ConfigurationPage {}
