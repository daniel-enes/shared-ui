import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_ITEMS, type NavItem } from './nav-items';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  styleUrl: './sidebar-nav.component.scss',
  templateUrl: './sidebar-nav.component.html',
})
export class SidebarNavComponent {

  readonly navItems = NAV_ITEMS;

  isCollapsed = false;

  toggleCollapse(): void {

    this.isCollapsed = !this.isCollapsed;
  }

  toggleChildren(item: NavItem): void {

    item.children = item.children ? undefined : item.children;
  }

  getLabel(label: string): string {

    return label;
  }

}
