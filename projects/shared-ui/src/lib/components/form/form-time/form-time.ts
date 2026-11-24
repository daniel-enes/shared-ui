import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

@Component({
  selector: 'ui-form-time',
  imports: [FormField],
  templateUrl: './form-time.html',
  styleUrl: './form-time.scss'
})
export class FormTime extends FormFieldBase<string> {

  label = input.required<string>();

  labelHidden = input(false);

  step = input<number | undefined>(undefined);

}