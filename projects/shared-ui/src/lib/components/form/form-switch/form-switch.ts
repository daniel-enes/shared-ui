import { Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

export type FormSwitchLabelPosition = 'start' | 'end';

@Component({
  selector: 'ui-form-switch',
  imports: [FormField],
  templateUrl: './form-switch.html',
  styleUrl: './form-switch.scss'
})
export class FormSwitch extends FormFieldBase<boolean> {
  readonly label = input.required<string>();
  readonly labelHidden = input(false);
  readonly labelPosition = input<FormSwitchLabelPosition>('end');
}