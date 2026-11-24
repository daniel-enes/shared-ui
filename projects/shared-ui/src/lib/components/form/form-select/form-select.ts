import {
  Component,
  input
} from '@angular/core';

import { FormField } from '@angular/forms/signals';

import { FormFieldBase } from '../../../forms/shared/form-field-base';

import { FormSelectOption } from './form-select-option.model';

@Component({
  selector: 'ui-form-select',
  imports: [FormField],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss'
})
export class FormSelect extends FormFieldBase<string> {

  // Specific properties
  label = input.required<string>();

  options = input.required<readonly FormSelectOption[]>();

  placeholder = input('Selecione uma opção');

  labelHidden = input(false);

}