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
  FormField
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
  FormTime,
  FormDateTime,
  FormCheckbox,
  FormRadioGroup,
  FormRadioGroupOption,
  FormSwitch,
  FormFieldGroup,
  FormFile,
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
  birthdate: string;
  preferredTime: string;
  appointment: string;
  acceptTerms: boolean;
  gender: string;
  notificationsEnabled: boolean;
  attachment: File | null;
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
    FormTime,
    FormDateTime,
    FormCheckbox,
    FormRadioGroup,
    FormSwitch,
    FormFieldGroup,
    FormFile,
    FormField,
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
    birthdate: '',
    preferredTime: '',
    appointment: '',
    acceptTerms: false,
    gender: '',
    notificationsEnabled: true,
    attachment: null as File | null
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

    // Birthdate (ISO YYYY-MM-DD, compatível com <input type="date">)
    const now = new Date();

    const todayIso = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      )
    ).toISOString().slice(0, 10);

    const minIso = '1900-01-01';

    required(path.birthdate);
    validate(path.birthdate, ({ value }) => {

      const date = value();

      if (!date) {
        return null;
      }

      if (date > todayIso) {
        return { kind: 'maxDate' };
      }

      if (date < minIso) {
        return { kind: 'minDate' };
      }

      return null;

    });

    // Preferred time
    required(path.preferredTime);

    // Appointment
    required(path.appointment); 

    // Gender
    required(path.gender);

    // File attachment
    required(path.attachment);
    validate(path.attachment, ({ value }) => {
      const file = value();

      if (!file) return null;

      if (file.size > 5 * 1024 * 1024) {
        return { kind: 'fileTooLarge' };
      }

      if (file.type !== 'application/pdf') {
        return { kind: 'invalidFileType' };
      }

      return null;
    });

    // Accept Terms
    validate(path.acceptTerms, ({ value }) => {
      return value()
        ? null
        : { kind: 'termsNotAccepted' };
    });

  });

  countries: FormSelectOption[] = [
    { label: 'Brasil', value: 'BR', disabled: true },
    { label: 'Finlândia', value: 'FI' },
    { label: 'Indonésia', value: 'ID' },
    { label: 'Portugal', value: 'PT' }
  ];

  readonly genderOptions: FormRadioGroupOption[] = [
    { label: 'Masculino', value: 'MALE' },
    { label: 'Feminino', value: 'FEMALE' },
    { label: 'Outro', value: 'OTHER' },
    { label: 'Prefiro não informar', value: 'NOT_INFORMED' }
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
