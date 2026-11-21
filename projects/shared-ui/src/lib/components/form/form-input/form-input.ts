import {
  Component,
  computed,
  inject,
  input
} from '@angular/core';

import {
  FieldTree,
  FormField
} from '@angular/forms/signals';

import {
  ValidationMessageConfig
} from '../../../forms/models/validation-message.model';

import {
  ValidationMessageService
} from '../../../forms/services/validation-message.service';

import { FormContext } from '../../../forms/services/form-context.service';

export type FormInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search';


@Component({
  selector: 'ui-form-input',
  imports: [FormField],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput {

  // Service to resolve validation messages
  private readonly messageService = inject(ValidationMessageService);

  // Service to check if the form has an alert and if it is visible
  private readonly formContext = inject(FormContext, {
    optional: true
  });

  readonly canReturnToAlert = computed(() => {
    return this.showError() &&
      (this.formContext?.canReturnToAlert() ?? false);
  });

  // Return to alert
  returnToAlert(): void {
    this.formContext?.focusAlert();
  }

  // Inputs
  field = input.required<FieldTree<string>>();

  label = input.required<string>();

  description = input('');

  placeholder = input('');

  type = input<FormInputType>('text');

  inputId = input<string | undefined>(undefined);

  fieldName = input<string | undefined>(undefined);

  messages = input<ValidationMessageConfig>({});

  pendingMessage = input('Verificando informações...');

  labelHidden = input(false);


  // Field state
  readonly fieldState = computed(() => this.field()());


  // Identification
  readonly resolvedFieldName = computed(
    () => this.fieldName() ?? this.fieldState().name()
  );

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

  readonly hasErrorMessage = computed(
    () => this.showError() && !!this.errorMessage()
  );

  // Error message
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