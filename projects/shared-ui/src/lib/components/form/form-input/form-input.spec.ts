import { Component, resource, signal } from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  form,
  required,
  minLength,
  validateAsync
} from '@angular/forms/signals';

import {
  ValidationMessageConfig
} from '../../../forms/models/validation-message.model';

import {
  FormInput
} from './form-input';


@Component({
  standalone: true,
  imports: [FormInput],
  template: `
    <ui-form-input
      [field]="registerForm.username"
      label="Username"
      placeholder="Digite seu username"
      [description]="description()"
      fieldName="username"
      [messages]="messages()"
      [labelHidden]="labelHidden()"
      [inputId]="inputId()"
    />
  `
})
class TestHostComponent {

  messages = signal<ValidationMessageConfig>({});

  description = signal('Utilize pelo menos 8 caracteres.');

  labelHidden = signal(false);

  inputId = signal<string | undefined>(undefined);

  model = signal({
    username: ''
  });

  registerForm = form(this.model, (path) => {

    required(path.username);

    minLength(path.username, 8);

  });

}

@Component({
  standalone: true,
  imports: [FormInput],
  template: `
    <ui-form-input
      [field]="registerForm.username"
      label="Username"
      description="Descrição do campo."
      pendingMessage="Validando username..."
      inputId="pending-username"
    />
  `
})
class PendingTestHostComponent {

  model = signal({
    username: 'daniel123'
  });

  private resolveValidation: (() => void) | undefined;

  registerForm = form(this.model, (path) => {

    validateAsync(path.username, {
      params: ({ value }) => value(),
      factory: (params) => resource({
        params,
        loader: () => new Promise<void>((resolve) => {
          this.resolveValidation = resolve;
        })
      }),
      onSuccess: () => [],
      onError: () => []
    });

  });

  finishValidation(): void {
    this.resolveValidation?.();
  }

}


describe('FormInput', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, PendingTestHostComponent]
    }).compileComponents();

  });


  it('should create the component', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('ui-form-input')
    ).toBeTruthy();

  });


  it('should associate the label with the input', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(label.getAttribute('for')).toBe(input.id);

  });

  it('should visually hide the label without removing its association', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.labelHidden.set(true);

    fixture.detectChanges();

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(label).toBeTruthy();
    expect(label.classList).toContain('visually-hidden');
    expect(label.getAttribute('for')).toBe(input.id);

  });


  it('should update the model when the user types', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = 'daniel123';

    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(
      fixture.componentInstance.model().username
    ).toBe('daniel123');

  });


  it('should display an error when the field is touched and invalid', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const feedback: HTMLElement =
      fixture.nativeElement.querySelector('.invalid-feedback');

    expect(feedback).toBeTruthy();

    expect(feedback.textContent).toContain(
      'Este campo é obrigatório.'
    );

    expect(input.getAttribute('aria-describedby')?.split(' '))
      .toContain(feedback.id);

  });

  it('should not reference a missing error message', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.messages.set({
      fields: {
        username: {
          required: ''
        }
      }
    });

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('.invalid-feedback')).toBeFalsy();
    expect(describedBy).not.toContain('ui-username-feedback');
    expect(
      describedBy.every((id) =>
        fixture.nativeElement.ownerDocument.getElementById(id)
      )
    ).toBe(true);

  });

  it('should display the placeholder', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.placeholder).toBe('Digite seu username');

  });

  it('should associate the description with the input using aria-describedby', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    const descriptionId = describedBy.find((id) => id.endsWith('-description'));

    expect(descriptionId).toBeTruthy();

    const description: HTMLElement | null = fixture.nativeElement
      .ownerDocument.getElementById(descriptionId!);
    expect(description).toBeTruthy();

    expect(description!.textContent).toContain(
      'Utilize pelo menos 8 caracteres.'
    );

    expect(description!.id).toBe(descriptionId);

  });

  it('should remove the description reference when no description is provided', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.description.set('');

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(fixture.nativeElement.querySelector('.form-text')).toBeFalsy();
    expect(input.hasAttribute('aria-describedby')).toBe(false);

  });

  it('should respect a custom input ID and derive auxiliary IDs from it', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.inputId.set('account-username');

    fixture.detectChanges();

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.id).toBe('account-username');
    expect(label.htmlFor).toBe('account-username');
    expect(fixture.nativeElement.querySelector('#account-username-description'))
      .toBeTruthy();

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('#account-username-feedback')
    ).toBeTruthy();

  });

  it('should expose pending validation accessibly until it completes', async () => {

    const fixture = TestBed.createComponent(PendingTestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const status: HTMLElement =
      fixture.nativeElement.querySelector('[role="status"]');

    expect(status).toBeTruthy();
    expect(status.textContent).toContain('Validando username...');
    expect(status.id).toBe('pending-username-pending');
    expect(input.getAttribute('aria-describedby')?.split(' '))
      .toContain(status.id);

    fixture.componentInstance.finishValidation();

    await fixture.whenStable();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeFalsy();
    expect(input.getAttribute('aria-describedby')?.split(' '))
      .not.toContain('pending-username-pending');

  });

  it('should set aria-invalid when the field is invalid and touched', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(input.getAttribute('aria-invalid')).toBe('true');

  });

  it('should hide the error when the field becomes valid', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    // Primeiro, deixa o campo inválido e tocado.
    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.invalid-feedback')
    ).toBeTruthy();

    // Corrige o valor.
    input.value = 'daniel123';

    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.invalid-feedback')
    ).toBeFalsy();

    expect(input.getAttribute('aria-invalid')).not.toBe('true');
    expect(input.getAttribute('aria-describedby')?.split(' '))
      .not.toContain('ui-username-feedback');

  });

});