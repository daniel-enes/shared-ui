import { Component } from '@angular/core';

import { DocsLayoutComponent } from './core/layout/docs-layout.component';

@Component({
  selector: 'app-root',
  imports: [DocsLayoutComponent],
  standalone: true,
  styleUrl: './app.scss',
  template: `<app-docs-layout />`,
})
export class App {}
