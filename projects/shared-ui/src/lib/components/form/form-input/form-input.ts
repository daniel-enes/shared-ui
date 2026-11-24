import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';
import { FormTextFieldBase } from '../../../forms/shared/form-text-field-base';

export type FormInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search';

@Component({
  selector: 'ui-form-input',
  imports: [FormField],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput extends FormTextFieldBase {

  // Input-specific properties
  label = input.required<string>();

  placeholder = input('');

  type = input<FormInputType>('text');

  labelHidden = input(false);

}