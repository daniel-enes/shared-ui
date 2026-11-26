import {
  Component,
  computed,
  input,
  output
} from '@angular/core';

import {
  Params,
  RouterLink
} from '@angular/router';

import {
  UiButtonSize,
  UiButtonVariant
} from '../button/button-variant.model';

export type RouterLinkTarget =
  | string
  | readonly unknown[]
  | null
  | undefined;

@Component({
  selector: 'ui-button-link',
  imports: [RouterLink],
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