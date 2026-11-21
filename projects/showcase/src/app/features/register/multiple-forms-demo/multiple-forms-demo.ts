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
  selector: 'app-multiple-forms-demo',
  imports: [
    FormInput,
    FormAlert,
    FormContextDirective,
    JsonPipe
  ],
  templateUrl: './multiple-forms-demo.html'
})
export class MultipleFormsDemo {

  // Primeiro formulário
  firstModel = signal<RegisterModel>({
    username: '',
    email: ''
  });

  firstSubmitted = signal(false);

  firstForm = form(this.firstModel, (path) => {
    required(path.username);
    minLength(path.username, 8);
    required(path.email);
    email(path.email);
  });


  // Segundo formulário
  secondModel = signal<RegisterModel>({
    username: '',
    email: ''
  });

  secondSubmitted = signal(false);

  secondForm = form(this.secondModel, (path) => {
    required(path.username);
    minLength(path.username, 8);
    required(path.email);
    email(path.email);
  });


  // Método compartilhado para submissão
  async onSubmit(
    event: Event,
    formTree: FieldTree<RegisterModel>,
    submitted: WritableSignal<boolean>,
    context: FormContextDirective
  ): Promise<void> {

    event.preventDefault();

    submitted.set(true);

    await submit(formTree, {

      action: async (field) => {
        console.log('Formulário válido:', field().value());
      },

      onInvalid: () => {
        context.requestAlertFocus();
      }

    });
  }
}