import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

@Component({
  selector: 'ui-form-datetime',
  imports: [FormField],
  templateUrl: './form-date-time.html',
  styleUrl: './form-date-time.scss'
})
export class FormDateTime extends FormFieldBase<string> {

  label = input.required<string>();

  labelHidden = input(false);

  step = input<number | undefined>(undefined);

}