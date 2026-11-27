import { Component, inject } from '@angular/core';

import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  standalone: true,
  styleUrl: './theme-toggle.component.scss',
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {

  readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  toggleTheme(): void {

    this.themeService.toggleTheme();
  }

}
