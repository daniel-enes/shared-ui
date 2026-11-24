import { Component, signal } from '@angular/core';

import {
  form,
  required,
  minLength,
  maxLength,
  pattern,
  email,
  validate,
  submit,
  min,
  max,
  maxDate,
  minDate
} from '@angular/forms/signals';

import {
  FormInput,
  FormAlert,
  FormContextDirective,
  FormTextarea,
  FormSelect,
  FormSelectOption,
  FormNumber,
  FormDate,
  FormTime
} from 'shared-ui';

import { REGISTER_FORM_MESSAGES } from '../config/register-form.config';


interface RegisterModel {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  description: string;
  country: string;
  age: number;
  birthdate: Date;
  preferredTime: string;
}

@Component({
  selector: 'app-register-form-demo',
  imports: [
    FormInput,
    FormAlert,
    FormContextDirective,
    FormTextarea,
    FormSelect,
    FormNumber,
    FormDate,
    FormTime
  ],
  templateUrl: './register-form-demo.html',
  styleUrl: './register-form-demo.scss'
})
export class RegisterFormDemo {

  // Configuration
  readonly messages = REGISTER_FORM_MESSAGES;

  // Form state
  readonly submitted = signal(false);
  readonly registered = signal(false);

  // Form model
  readonly model = signal<RegisterModel>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    country: '',
    age: 0,
    birthdate: new Date(),
    preferredTime: ''
  });

  // Signal Forms
  readonly registerForm = form(this.model, (path) => {

    // Name
    required(path.name);
    minLength(path.name, 2);
    maxLength(path.name, 150);

    // Username
    required(path.username);
    pattern(path.username, /^[a-z0-9-]+$/);

    // Simulates a username already registered in the backend.
    validate(path.username, ({ value }) => {
      return value() === 'usuario-existente'
        ? { kind: 'USERNAME_EXISTS' }
        : null;
    });

    // Email
    required(path.email);
    email(path.email);

    // Simulates an email already registered in the backend.
    validate(path.email, ({ value }) => {
      return value() === 'existente@exemplo.com'
        ? { kind: 'EMAIL_EXISTS' }
        : null;
    });

    // Password
    required(path.password);
    minLength(path.password, 8);
    maxLength(path.password, 30);
    pattern(path.password, /^(?=.*[a-zA-Z])(?=.*\d).+$/);

    // Confirm password
    required(path.confirmPassword);

    // Form-level validation
    validate(path, ({ value }) => {

      const { password, confirmPassword } = value();

      // The required validator handles an empty confirmation.
      if (!confirmPassword || password === confirmPassword) {
        return null;
      }

      return {
        kind: 'passwordMismatch'
      };

    });

    // Description
    required(path.description);
    minLength(path.description, 10);
    maxLength(path.description, 300);

    // Country
    required(path.country);

    // Age
    required(path.age);
    min(path.age, 18);
    max(path.age, 120);

    // Birthdate
    const now = new Date();

    const today = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      )
    );

    // Birthdate
    required(path.birthdate);
    maxDate(path.birthdate, today);
    minDate(
      path.birthdate,
      new Date('1900-01-01')
    );

    // Preferred time
    required(path.preferredTime);

  });

  countries: FormSelectOption[] = [
    { label: 'Brasil', value: 'BR', disabled: true },
    { label: 'Finlândia', value: 'FI' },
    { label: 'Indonésia', value: 'ID' },
    { label: 'Portugal', value: 'PT' }
  ];

  async onSubmit(
    event: Event,
    context: FormContextDirective
  ): Promise<void> {

    event.preventDefault();

    this.submitted.set(true);
    this.registered.set(false);

    await submit(this.registerForm, {

      action: async () => {
        // No backend integration in this demo.
        this.registered.set(true);
      },

      onInvalid: () => {
        context.requestAlertFocus();
      }

    });

  }

}
