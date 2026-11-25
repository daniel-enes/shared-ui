import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-form-field-group',
  templateUrl: './form-field-group.html',
  styleUrl: './form-field-group.scss'
})
export class FormFieldGroup {
  readonly label = input.required<string>();
  readonly description = input('');
  readonly labelHidden = input(false);
}