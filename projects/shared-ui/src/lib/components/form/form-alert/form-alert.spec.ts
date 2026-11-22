import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  form,
  required,
  minLength,
  validate
} from '@angular/forms/signals';

import {
  ValidationMessageConfig
} from '../../../forms/models/validation-message.model';

import {
  FormAlert,
  FormInput,
  FormContextDirective
} from 'shared-ui';


@Component({
  standalone: true,
  imports: [
    FormAlert,
    FormInput,
    FormContextDirective
  ],
  template: `
    <form
      uiFormContext
      #formContext="uiFormContext"
    >

      <ui-form-alert
        [form]="registerForm"
        [messages]="messages()"
      />

      <ui-form-input
        [field]="registerForm.username"
        label="Username"
        fieldName="username"
        [messages]="messages()"
      />

      <button
        type="button"
        id="request-focus"
        (click)="formContext.requestAlertFocus()"
      >
        Solicitar foco
      </button>

    </form>
  `
})
class TestHostComponent {

  model = signal({
    username: ''
  });

  messages = signal<ValidationMessageConfig>({});

  registerForm = form(this.model, (path) => {
    required(path.username);
    minLength(path.username, 8);
  });

}

@Component({
  standalone: true,
  imports: [
    FormAlert,
    FormContextDirective
  ],
  template: `
    <form uiFormContext #formContext="uiFormContext">
      <ui-form-alert
        [form]="registerForm"
        [messages]="messages"
      />

      <button
        type="button"
        id="request-focus"
        (click)="formContext.requestAlertFocus()"
      >
        Solicitar foco
      </button>
    </form>
  `
})
class FormLevelErrorHostComponent {

  model = signal({
    username: 'daniel123'
  });

  messages: ValidationMessageConfig = {
    form: {
      passwordMismatch: 'As senhas devem coincidir.'
    }
  };

  registerForm = form(this.model, (path) => {
    validate(path, () => ({
      kind: 'passwordMismatch'
    }));
  });

}

function requestAlert(fixture: {
  nativeElement: HTMLElement;
  detectChanges: () => void;
}): void {
  const button =
  fixture.nativeElement.querySelector<HTMLButtonElement>('#request-focus');

  if (!button) {
    throw new Error('Botão de solicitação de foco não encontrado.');
  }

  button.click();
  fixture.detectChanges();
}

describe('FormAlert', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, FormLevelErrorHostComponent]
    }).compileComponents();

  });


  it('should create the component', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('ui-form-alert');

    expect(alert).toBeTruthy();

  });


  it('should not display the alert when the form has not been submitted', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.form-alert');

    expect(alert).toBeFalsy();

  });


  it('should display the alert when the form is submitted and has errors', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    const alert = fixture.nativeElement.querySelector('.form-alert');

    expect(alert).toBeTruthy();
  });

  it('should display validation error messages', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    expect(alert).toBeTruthy();

    expect(alert.textContent).toContain(
      'Este campo é obrigatório.'
    );

  });

  it('should use the field-specific message in the error summary', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.messages.set({
      fields: {
        username: {
          required: 'Username personalizado é obrigatório.'
        }
      }
    });

    fixture.detectChanges();

    requestAlert(fixture);

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    expect(alert.textContent).toContain(
      'Username personalizado é obrigatório.'
    );

  });

  it('should use form-level messages for errors attached to the form', () => {
    const fixture = TestBed.createComponent(FormLevelErrorHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    const formError =
      alert.querySelector('.form-alert__form-error');

    const errorButton =
      alert.querySelector('.form-alert__error-link');

    expect(alert.textContent).toContain(
      'As senhas devem coincidir.'
    );

    expect(formError).toBeTruthy();
    expect(errorButton).toBeFalsy();
  });

  it('should focus the corresponding field when an error is clicked', async () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    await fixture.whenStable();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const errorButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.form-alert__error-link');

    expect(errorButton).toBeTruthy();

    errorButton.click();

    expect(document.activeElement).toBe(input);

  });

  it('should have the correct accessibility attributes', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    const title: HTMLElement =
      alert.querySelector('h2')!;

    expect(alert.getAttribute('role')).toBe('region');

    expect(alert.getAttribute('tabindex')).toBe('-1');

    expect(alert.getAttribute('aria-labelledby')).toBe(title.id);

  });

  it('should focus the alert after an explicit focus request', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    requestAlert(fixture);

    await fixture.whenStable();

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    expect(alert).toBeTruthy();
    expect(document.activeElement).toBe(alert);
  });

  it('should focus the alert again when a new focus request is made', async () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    // Exibe o resumo de erros.
    requestAlert(fixture);

    await fixture.whenStable();

    const alert: HTMLElement =
      fixture.nativeElement.querySelector('.form-alert');

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const requestButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('#request-focus');

    // Simula o usuário navegando para outro campo.
    input.focus();

    expect(document.activeElement).toBe(input);

    // Solicita novamente o foco no resumo.
    requestButton.click();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(document.activeElement).toBe(alert);

  });

  it('should not display the alert when the submitted form has no errors', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.model.set({
      username: 'daniel123'
    });

    requestAlert(fixture);

    const alert = fixture.nativeElement.querySelector('.form-alert');

    expect(alert).toBeFalsy();

  });




});