import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';
import { FormTextFieldBase } from '../../../forms/shared/form-text-field-base';

@Component({
  selector: 'ui-form-textarea',
  imports: [FormField],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss'
})
export class FormTextarea extends FormTextFieldBase {

  // Specific properties
  label = input.required<string>();

  placeholder = input('');

  rows = input(3);

  labelHidden = input(false);

}