import {
  Component,
  signal,
  WritableSignal
} from '@angular/core';

import {
  FieldTree,
  form,
  required,
  minLength,
  email,
  submit
} from '@angular/forms/signals';

import {
  FormInput,
  FormAlert,
  FormContextDirective
} from 'shared-ui';

import { JsonPipe } from '@angular/common';

interface RegisterModel {
  username: string;
  email: string;
}

@Component({
  selector: 'app-form-input-demo',
  imports: [
    FormInput,
    FormAlert,
    FormContextDirective,
    JsonPipe
  ],
  templateUrl: './form-input-demo.html'
})
export class FormInputDemo {

  model = signal<RegisterModel>({
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

  async onSubmit(
    event: Event,
    context: FormContextDirective
  ): Promise<void> {

    event.preventDefault();

    this.submitted.set(true);

    await submit(this.registerForm, {
      action: async (field) => {
        console.log('Formulário válido:', field().value());
      },

      onInvalid: () => {
        context.requestAlertFocus();
      }
    });
  }
}