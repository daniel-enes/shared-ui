import { Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';
import { FormRadioGroupOption } from './form-radio-group-option';

@Component({
  selector: 'ui-form-radio-group',
  imports: [FormField],
  templateUrl: './form-radio-group.html',
  styleUrl: './form-radio-group.scss'
})
export class FormRadioGroup extends FormFieldBase<string> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly FormRadioGroupOption[]>();
  readonly labelHidden = input(false);
  readonly inline = input(false);
}