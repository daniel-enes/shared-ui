import { Directive, inject } from '@angular/core';

import { FormContext } from '../services/form-context.service';

@Directive({
  selector: '[uiFormContext]',
  exportAs: 'uiFormContext',
  providers: [FormContext]
})
export class FormContextDirective {

  private readonly context = inject(FormContext);

  requestAlertFocus(): void {
    this.context.requestAlertFocus();
  }

}