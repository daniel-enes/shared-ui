import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild
} from '@angular/core';

import {
  FieldTree,
  ReadonlyFieldTree
} from '@angular/forms/signals';

import { ValidationMessageConfig } from '../../../forms/models/validation-message.model';
import { ValidationMessageService } from '../../../forms/services/validation-message.service';
import { FormContext } from '../../../forms/services/form-context.service';
import { UniqueIdService } from '../../../forms/services/unique-id.service';

interface FormAlertError {
  id: string;
  kind: string;
  message: string;
  fieldName: string;
  fieldTree: ReadonlyFieldTree<unknown>;
  isFormError: boolean;
}

@Component({
  selector: 'ui-form-alert',
  templateUrl: './form-alert.html',
  styleUrl: './form-alert.scss',
})
export class FormAlert {

  // Services
  private readonly messageService = inject(ValidationMessageService);
  private readonly formContext = inject(FormContext);
  private readonly idService = inject(UniqueIdService);

  // Lifecycle
  private readonly destroyRef = inject(DestroyRef);

  // View Children
  private readonly alertElement =
    viewChild<ElementRef<HTMLElement>>('alertElement');

  // Identification
  private readonly generatedAlertId =
    this.idService.generate('alert');

  readonly titleId = computed(
    () => `${this.generatedAlertId}-title`
  );

  // Inputs
  form = input.required<FieldTree<unknown>>();

  messages = input<ValidationMessageConfig>({});

  // Computed Properties
  readonly alertErrors = computed<FormAlertError[]>(() => {
    return this.form()().errorSummary().map((error, index) => {

      const fieldTree = error.fieldTree;
      const isFormError = fieldTree === this.form();
      const fieldPath = fieldTree().name();
      const fieldName = fieldPath.split('.').pop() ?? fieldPath;

      const message = this.messageService.resolve(error, {
        field: isFormError ? undefined : fieldName,
        scope: isFormError ? 'form' : 'field',
        config: this.messages()
      });

      return {
        id: `${error.kind}-${index}`,
        kind: error.kind,
        message,
        fieldName,
        fieldTree,
        isFormError
      };

    });
  });

  readonly visible = computed(
    () =>
      this.formContext.alertRequested() &&
      this.alertErrors().length > 0
  );

  constructor() {

    effect(() => {
      if (this.alertErrors().length === 0) {
        this.formContext.hideAlert();
      }
    });

    const unregister = this.formContext.registerAlert({
      visible: this.visible,
      focus: () => {
        this.alertElement()?.nativeElement.focus();
      }
    });

    this.destroyRef.onDestroy(unregister);

    let previousFocusRequest = this.formContext.focusRequest();

    afterRenderEffect({
      write: () => {
        const visible = this.visible();

        const currentFocusRequest =
          this.formContext.focusRequest();

        const shouldFocus =
          visible &&
          currentFocusRequest !== previousFocusRequest;

        previousFocusRequest = currentFocusRequest;

        if (shouldFocus) {
          this.alertElement()?.nativeElement.focus();
        }
      }
    });

  }

  focusError(error: FormAlertError): void {
    error.fieldTree().focusBoundControl();
  }

  returnToAlert(): void {
    this.formContext.focusAlert();
  }

}