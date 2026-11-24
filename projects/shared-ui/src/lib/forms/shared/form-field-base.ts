import {
  computed,
  Directive,
  inject,
  input,
  signal
} from '@angular/core';

import { FieldTree } from '@angular/forms/signals';

import { ValidationMessageConfig } from '../models/validation-message.model';
import { ValidationMessageService } from '../services/validation-message.service';
import { FormContext } from '../services/form-context.service';

@Directive()
export abstract class FormFieldBase<TValue> {

  // Services
  protected readonly messageService = inject(ValidationMessageService);

  private readonly formContext = inject(FormContext, {
    optional: true
  });

  // Common inputs
  field = input.required<FieldTree<TValue>>();

  description = input('');

  inputId = input<string | undefined>(undefined);

  fieldName = input<string | undefined>(undefined);

  messages = input<ValidationMessageConfig>({});

  pendingMessage = input('Verificando informações...');

  // State
  private readonly hasFocus = signal(false);

  // Field state
  readonly fieldState = computed(() => this.field()());

  // Identification
  readonly resolvedFieldName = computed(() => {
    if (this.fieldName()) {
      return this.fieldName();
    }

    const fieldPath = this.fieldState().name();

    return fieldPath.split('.').pop() ?? fieldPath;
  });

  readonly resolvedInputId = computed(
    () => this.inputId() ?? `ui-${this.fieldState().name()}`
  );

  readonly descriptionId = computed(
    () => `${this.resolvedInputId()}-description`
  );

  readonly feedbackId = computed(
    () => `${this.resolvedInputId()}-feedback`
  );

  readonly pendingId = computed(
    () => `${this.resolvedInputId()}-pending`
  );

  // Validation state
  readonly isTouched = computed(
    () => this.fieldState().touched()
  );

  readonly isInvalid = computed(
    () => this.fieldState().invalid()
  );

  readonly isPending = computed(
    () => this.fieldState().pending()
  );

  readonly showError = computed(
    () => this.isTouched() && this.isInvalid()
  );

  readonly errorMessage = computed(() => {

    if (!this.showError()) {
      return null;
    }

    const error = this.fieldState().errors()[0];

    if (!error) {
      return null;
    }

    return this.messageService.resolve(error, {
      field: this.resolvedFieldName(),
      scope: 'field',
      config: this.messages()
    });

  });

  readonly hasErrorMessage = computed(
    () => this.showError() && !!this.errorMessage()
  );

  // Focus management
  readonly canReturnToAlert = computed(() => {
    return this.hasFocus() &&
      (this.formContext?.canReturnToAlert() ?? false);
  });

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

  returnToAlert(): void {
    this.formContext?.focusAlert();
  }

  // Accessibility
  readonly describedBy = computed(() => {

    const ids: string[] = [];

    if (this.description()) {
      ids.push(this.descriptionId());
    }

    if (this.hasErrorMessage()) {
      ids.push(this.feedbackId());
    }

    if (this.isPending()) {
      ids.push(this.pendingId());
    }

    return ids.length > 0 ? ids.join(' ') : null;

  });

}