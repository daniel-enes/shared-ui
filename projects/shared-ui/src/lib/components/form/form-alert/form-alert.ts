import {
  Component,
  computed,
  inject,
  input
} from '@angular/core';

import {
  FieldTree,
  ReadonlyFieldTree
} from '@angular/forms/signals';

import { ValidationMessageConfig } from '../../../forms/models/validation-message.model';
import { ValidationMessageService } from '../../../forms/services/validation-message.service';


interface FormAlertError {
  id: string;
  kind: string;
  message: string;
  fieldName?: string;
  fieldTree?: ReadonlyFieldTree<unknown>;
}

@Component({
  selector: 'ui-form-alert',
  imports: [],
  templateUrl: './form-alert.html',
  styleUrl: './form-alert.scss',
})
export class FormAlert {

  private readonly messageService = inject(ValidationMessageService);

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

  focusError(error: FormAlertError): void {
    error.fieldTree?.().focusBoundControl();
  }

}