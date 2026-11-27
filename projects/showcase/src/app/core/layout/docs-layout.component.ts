import { Component } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

import { ThemeToggleComponent } from '../theme/theme-toggle.component';
import { LangSwitchComponent } from '../i18n/lang-switch.component';
import { SidebarNavComponent } from '../navigation/sidebar-nav.component';
import { PageTocComponent } from '../navigation/page-toc.component';

@Component({
  selector: 'app-docs-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    ThemeToggleComponent,
    LangSwitchComponent,
    SidebarNavComponent,
    PageTocComponent,
  ],
  standalone: true,
  styleUrl: './docs-layout.component.scss',
  templateUrl: './docs-layout.component.html',
})
export class DocsLayoutComponent {}
