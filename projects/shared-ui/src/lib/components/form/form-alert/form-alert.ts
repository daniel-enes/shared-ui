import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
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


interface FormAlertError {
  id: string;
  kind: string;
  message: string;
  fieldName: string;
  fieldTree: ReadonlyFieldTree<unknown>;
}

@Component({
  selector: 'ui-form-alert',
  templateUrl: './form-alert.html',
  styleUrl: './form-alert.scss',
})
export class FormAlert {

  private readonly messageService = inject(ValidationMessageService);

  private readonly formContext = inject(FormContext, {
    optional: true
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly alertElement =
    viewChild<ElementRef<HTMLElement>>('alertElement');

  form = input.required<FieldTree<unknown>>();

  submitted = input(false);

  messages = input<ValidationMessageConfig>({});

  readonly alertErrors = computed<FormAlertError[]>(() => {
    return this.form()().errorSummary().map((error, index) => {

      const fieldTree = error.fieldTree;
      const fieldName = fieldTree().name();

      const message = this.messageService.resolve(error, {
        field: fieldName,
        scope: 'field',
        config: this.messages()
      });

      return {
        id: `${error.kind}-${index}`,
        kind: error.kind,
        message,
        fieldName,
        fieldTree
      };

    });
  });

  readonly visible = computed(() => {
    return this.submitted() && this.alertErrors().length > 0;
  });

  constructor() {

    if (this.formContext) {

      const unregister = this.formContext.registerAlert({
        visible: this.visible,
        focus: () => {
          this.alertElement()?.nativeElement.focus();
        }
      });

      this.destroyRef.onDestroy(unregister);

    }

    let wasVisible = false;

    let previousFocusRequest =
      this.formContext?.focusRequest() ?? 0;

    afterRenderEffect({
      write: () => {
        const visible = this.visible();

        const currentFocusRequest =
          this.formContext?.focusRequest() ?? 0;

        const shouldFocus =
          visible &&
          (
            !wasVisible ||
            currentFocusRequest !== previousFocusRequest
          );

        wasVisible = visible;
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
    this.formContext?.focusAlert();
  }

}