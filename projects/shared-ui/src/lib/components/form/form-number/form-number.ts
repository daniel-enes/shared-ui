import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

@Component({
  selector: 'ui-form-number',
  imports: [FormField],
  templateUrl: './form-number.html',
  styleUrl: './form-number.scss'
})
export class FormNumber extends FormFieldBase<number> {

  label = input.required<string>();

  placeholder = input('');

  step = input<number | undefined>(undefined);

  labelHidden = input(false);

  hideSpinner = input(false);

}