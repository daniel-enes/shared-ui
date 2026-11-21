import {
  Component,
  signal
} from '@angular/core';

import {
  form,
  required,
  minLength,
  email
} from '@angular/forms/signals';

import {
  FormInput,
  FormAlert
} from 'shared-ui';


import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-form-input-demo',
  standalone: true,
  imports: [FormInput, JsonPipe, FormAlert],
  templateUrl: './form-input-demo.html'
})
export class FormInputDemo {

  model = signal({
    username: '',
    email: ''
  });

  submitted = signal(false);

  registerForm = form(this.model, (path) => {

    required(path.username);

    minLength(path.username, 8);

    required(path.email);

    email(path.email);

  });

  onSubmit(): void {
    this.submitted.set(true);
    this.registerForm().markAsTouched();
  }

}