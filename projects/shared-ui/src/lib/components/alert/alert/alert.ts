import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';

import { UniqueIdService } from '../../../forms/services/unique-id.service';

import { UiAlertVariant } from './alert-variant.model';

/**
 * Apresenta feedbacks de operações realizadas na aplicação, independentes de formulários.
 *
 * O componente recebe foco programático quando se torna visível e também quando seu
 * conteúdo (título ou mensagem) muda enquanto permanece visível. O estado de visibilidade
 * e o fechamento são controlados pela aplicação consumidora.
 *
 * Acessibilidade: utiliza role="status" e aria-live="polite" para todas as variantes.
 * A variante controla apenas a apresentação visual, não a urgência da comunicação.
 * Como o componente também recebe foco programático, há possibilidade de anúncios
 * duplicados em leitores de tela (foco + região live). Essa tradeoff é intencional e
 * documentada; a aplicação consumidora controla a visibilidade para evitar excesso de anúncios.
 */
@Component({
  selector: 'ui-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class UiAlert {

  private readonly alertElement =
    viewChild<ElementRef<HTMLElement>>('alertElement');

  private readonly idService = inject(UniqueIdService);
  private readonly generatedAlertId = this.idService.generate('alert');

  // Inputs
  readonly title = input('');

  readonly message = input.required<string>();

  readonly variant = input<UiAlertVariant>('success');

  readonly visible = input(false);

  readonly dismissible = input(false);

  // Outputs
  readonly dismissed = output<void>();

  // Computed
  readonly titleId = computed(
    () => `${this.generatedAlertId}-title`
  );

  readonly alertClasses = computed(() => {
    const classes = ['ui-alert', 'alert', `alert-${this.variant()}`];

    if (this.dismissible()) {
      classes.push('alert-dismissible');
    }

    return classes.join(' ');
  });

  constructor() {
    afterRenderEffect(() => {
      const visible = this.visible();

      if (!visible) {
        return;
      }

      // Ler title e message para que alterações nesses sinais, enquanto o alerta
      // estiver visível, retriggerem este efeito e o elemento receba foco novamente.
      this.title();
      this.message();

      this.alertElement()?.nativeElement.focus();
    });
  }

  onDismiss(): void {
    this.dismissed.emit();
  }

}
