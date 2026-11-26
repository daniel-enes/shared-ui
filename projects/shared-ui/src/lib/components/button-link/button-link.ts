import {
  Component,
  computed,
  input,
  output
} from '@angular/core';

import {
  Params,
  RouterLink,
  UrlTree
} from '@angular/router';

import {
  UiButtonSize,
  UiButtonVariant
} from '../button/button-variant.model';

export type RouterLinkTarget =
  | string
  | readonly unknown[]
  | UrlTree
  | null
  | undefined;

/**
 * Navega para um destino e renderiza um elemento `<a>` com `RouterLink`.
 *
 * Classes aplicadas diretamente a `<ui-button-link>` (por exemplo, `class="mt-2"`)
 * são aplicadas ao elemento host, e não ao `<a>` interno. Para estilizar o
 * elemento interno, utilize os inputs visuais (`variant`, `size`, `fullWidth`).
 */
@Component({
  selector: 'ui-button-link',
  imports: [RouterLink],
  host: {
    '[class.ui-button-link--full-width]': 'fullWidth()'
  },
  templateUrl: './button-link.html',
  styleUrl: './button-link.scss'
})
export class UiButtonLink {

  // Inputs
  readonly text = input('');

  readonly icon = input('');

  readonly variant = input<UiButtonVariant>('primary');

  readonly size = input<UiButtonSize | undefined>(undefined);

  readonly routerLink = input.required<RouterLinkTarget>();

  readonly queryParams = input<Params | null>(null);

  readonly fragment = input('');

  readonly target = input('');

  readonly rel = input('');

  readonly replaceUrl = input(false);

  readonly ariaLabel = input('');

  readonly title = input('');

  readonly fullWidth = input(false);

  // Outputs
  readonly clicked = output<void>();

  // Computed Properties
  readonly resolvedTitle = computed(
    () => this.title() || this.ariaLabel()
  );

  readonly linkClasses = computed(() => {
    const classes = ['btn', `btn-${this.variant()}`];

    const size = this.size();

    if (size) {
      classes.push(`btn-${size}`);
    }

    if (this.fullWidth()) {
      classes.push('w-100');
    }

    return classes.join(' ');
  });

  handleClick(): void {
    this.clicked.emit();
  }

}