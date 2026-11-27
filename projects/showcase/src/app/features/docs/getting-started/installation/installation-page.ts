import { Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-installation-page',
  imports: [TranslocoPipe],
  standalone: true,
  styleUrl: './installation-page.scss',
  templateUrl: './installation-page.html',
})
export class InstallationPage {}
