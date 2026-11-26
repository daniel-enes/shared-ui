import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

@Component({
  selector: 'ui-form-date',
  imports: [FormField],
  templateUrl: './form-date.html',
  styleUrl: './form-date.scss'
})
export class FormDate extends FormFieldBase<string> {

  label = input.required<string>();

  labelHidden = input(false);

}