import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { NAV_ITEMS, type NavItem } from './nav-items';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  styleUrl: './sidebar-nav.component.scss',
  templateUrl: './sidebar-nav.component.html',
})
export class SidebarNavComponent {

  private readonly route = inject(ActivatedRoute);

  private readonly transloco = inject(TranslocoService);

  readonly navItems = NAV_ITEMS;

  readonly currentLang = this.route.snapshot.paramMap.get('lang') ?? 'en';

  isCollapsed = false;

  toggleCollapse(): void {

    this.isCollapsed = !this.isCollapsed;
  }

  toggleChildren(item: NavItem): void {

    item.children = item.children ? undefined : item.children;
  }

  getLabel(key: string): string {

    return this.transloco.translate(key);
  }

  linkFor(path: string): string {

    return `/${this.currentLang}/docs/${path}`;
  }

}
