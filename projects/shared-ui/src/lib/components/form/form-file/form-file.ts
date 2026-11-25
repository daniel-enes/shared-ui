import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
  inject
} from '@angular/core';

import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals';

import { FormContext } from '../../../forms/services/form-context.service';
import { ValidationMessageService } from '../../../forms/services/validation-message.service';
import { ValidationMessageConfig } from '../../../forms/models/validation-message.model';

@Component({
  selector: 'ui-form-file',
  templateUrl: './form-file.html',
  styleUrl: './form-file.scss'
})
export class FormFile implements FormValueControl<File | null> {

  private readonly messageService = inject(ValidationMessageService);
  private readonly formContext = inject(FormContext, { optional: true });

  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // Integração com Signal Forms
  readonly value = model<File | null>(null);

  readonly touched = input(false);
  readonly touch = output<void>();

  readonly disabled = input(false);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly pending = input(false);
  readonly errors =
    input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly name = input<string, unknown>('', {
    transform: (value: unknown) =>
      typeof value === 'string' ? value : ''
  });

  // Configurações visuais
  readonly label = input.required<string>();
  readonly labelHidden = input(false);
  readonly description = input('');
  readonly accept = input('');
  readonly inputId = input<string | undefined>(undefined);
  readonly fieldName = input<string | undefined>(undefined);
  readonly messages = input<ValidationMessageConfig>({});
  readonly pendingMessage = input('Verificando arquivo...');

  private readonly hasFocus = signal(false);

  readonly resolvedInputId = computed(
    () => this.inputId() ?? 'ui-file'
  );

  readonly resolvedFieldName = computed(() => {
    if (this.fieldName()) {
      return this.fieldName()!;
    }

    const fieldPath = this.name();

    if (fieldPath) {
      return fieldPath.split('.').pop()!;
    }

    return this.label();
  });

  readonly descriptionId = computed(
    () => `${this.resolvedInputId()}-description`
  );

  readonly feedbackId = computed(
    () => `${this.resolvedInputId()}-feedback`
  );

  readonly pendingId = computed(
    () => `${this.resolvedInputId()}-pending`
  );

  readonly fileName = computed(
    () => this.value()?.name ?? null
  );

  readonly showError = computed(
    () => this.touched() && this.invalid()
  );

  readonly errorMessage = computed(() => {
    if (!this.showError()) return null;

    const error = this.errors()[0];

    if (!error) return null;

    console.log('FormFile - field name:', this.name());
    console.log('FormFile - resolved field:', this.resolvedFieldName());
    console.log('FormFile - messages:', this.messages());
    console.log('FormFile - error:', error);

    return this.messageService.resolve(error, {
      field: this.resolvedFieldName(),
      scope: 'field',
      config: this.messages()
    });
  });

  readonly hasErrorMessage = computed(
    () => this.showError() && !!this.errorMessage()
  );

  readonly canReturnToAlert = computed(
    () => this.hasFocus() &&
      (this.formContext?.canReturnToAlert() ?? false)
  );

  readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.description()) {
      ids.push(this.descriptionId());
    }

    if (this.hasErrorMessage()) {
      ids.push(this.feedbackId());
    }

    if (this.pending()) {
      ids.push(this.pendingId());
    }

    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    // O navegador não permite restaurar programaticamente
    // um arquivo selecionado. Podemos, entretanto, limpar o input.
    effect(() => {
      if (this.value() === null) {
        const input = this.fileInput()?.nativeElement;

        if (input) {
          input.value = '';
        }
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;

    this.value.set(file);
  }

  clearSelection(): void {
    this.value.set(null);
  }

  onFocusIn(): void {
    this.hasFocus.set(true);
  }

  onFocusOut(event: FocusEvent): void {
    const container = event.currentTarget as HTMLElement;
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && container.contains(nextTarget)) {
      return;
    }

    this.hasFocus.set(false);
  }

  focus(options?: FocusOptions): void {
    this.fileInput()?.nativeElement.focus(options);
  }

  returnToAlert(): void {
    this.formContext?.focusAlert();
  }
}