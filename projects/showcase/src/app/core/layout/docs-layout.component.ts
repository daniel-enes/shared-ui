import { Component } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

import { ThemeToggleComponent } from '../theme/theme-toggle.component';

@Component({
  selector: 'app-docs-layout',
  imports: [RouterLink, RouterOutlet, ThemeToggleComponent],
  standalone: true,
  styleUrl: './docs-layout.component.scss',
  templateUrl: './docs-layout.component.html',
})
export class DocsLayoutComponent {}
