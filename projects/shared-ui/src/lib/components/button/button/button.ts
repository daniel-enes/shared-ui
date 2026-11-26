import {
  Component,
  computed,
  input,
  output
} from '@angular/core';

import {
  UiButtonSize,
  UiButtonVariant
} from '../button-variant.model';

/**
 * Executa uma ação e renderiza um elemento `<button>`.
 *
 * Classes aplicadas diretamente a `<ui-button>` (por exemplo, `class="mt-2"`)
 * são aplicadas ao elemento host, e não ao `<button>` interno. Para estilizar o
 * elemento interno, utilize os inputs visuais (`variant`, `size`, `fullWidth`).
 */
@Component({
  selector: 'ui-button',
  host: {
    '[class.ui-button--full-width]': 'fullWidth()'
  },
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class UiButton {

  // Inputs
  readonly text = input('');

  readonly icon = input('');

  readonly variant = input<UiButtonVariant>('primary');

  readonly size = input<UiButtonSize | undefined>(undefined);

  readonly type = input<'button' | 'submit'>('button');

  readonly loading = input(false);

  readonly loadingMessage = input('Carregando...');

  readonly disabled = input(false);

  readonly ariaLabel = input('');

  readonly title = input('');

  readonly fullWidth = input(false);

  // Outputs
  readonly clicked = output<void>();

  // Computed Properties
  readonly resolvedTitle = computed(
    () => this.title() || this.ariaLabel()
  );

  readonly isDisabled = computed(
    () => this.disabled() || this.loading()
  );

  readonly buttonClasses = computed(() => {
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
    if (this.isDisabled()) {
      return;
    }

    this.clicked.emit();
  }

}