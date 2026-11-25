import { Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

@Component({
  selector: 'ui-form-checkbox',
  imports: [FormField],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss'
})
export class FormCheckbox extends FormFieldBase<boolean> {
  readonly label = input.required<string>();
  readonly labelHidden = input(false);
}