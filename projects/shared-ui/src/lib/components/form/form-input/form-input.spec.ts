import { Component, resource, signal } from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  form,
  required,
  minLength,
  validateAsync,
  maxLength
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
      [descriptionItems]="descriptionItems()"
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

  descriptionItems = signal<readonly string[]>([]);

  labelHidden = signal(false);

  inputId = signal<string | undefined>(undefined);

  model = signal({
    username: ''
  });

  registerForm = form(this.model, (path) => {

    required(path.username);

    minLength(path.username, 8);
    maxLength(path.username, 20)
    
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

@Component({
  standalone: true,
  imports: [FormInput],
  template: `
    <ui-form-input
      [field]="firstForm.username"
      label="Primeiro username"
    />

    <ui-form-input
      [field]="secondForm.username"
      label="Segundo username"
    />
  `
})
class DuplicateFieldsHostComponent {

  firstModel = signal({
    username: ''
  });

  secondModel = signal({
    username: ''
  });

  firstForm = form(this.firstModel);

  secondForm = form(this.secondModel);

}

describe('FormInput', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        PendingTestHostComponent,
        DuplicateFieldsHostComponent
      ]
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

    const descriptionId = `${input.id}-description`;
    const counterId = `${input.id}-character-count`;

    const description =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId);

    const counter =
      fixture.nativeElement.ownerDocument.getElementById(counterId);

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(description).toBeFalsy();
    expect(describedBy).not.toContain(descriptionId);
    expect(counter).toBeTruthy();
  });

  it('should display the description items list', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF',
      'Tamanho máximo de 5 MB'
    ]);
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const list: HTMLUListElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${input.id}-description`
      );

    expect(list).toBeTruthy();

    const items = list!.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Apenas arquivos PDF');
    expect(items[1].textContent).toContain('Tamanho máximo de 5 MB');
  });

  it('should display description text before the items list', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF'
    ]);
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const container: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${input.id}-description`
      );

    expect(container).toBeTruthy();
    expect(container!.innerHTML.indexOf('Utilize pelo menos 8 caracteres.'))
      .toBeLessThan(container!.innerHTML.indexOf('<li'));
  });

  it('should associate the description items list with the input using aria-describedby', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF'
    ]);
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    const descriptionId = describedBy.find((id) => id.endsWith('-description'));

    expect(descriptionId).toBeTruthy();

    const list: HTMLElement | null = fixture.nativeElement
      .ownerDocument.getElementById(descriptionId!);

    expect(list).toBeTruthy();
    expect(list.tagName).toBe('UL');
    expect(describedBy).toContain(descriptionId!);
  });

  it('should not render description container when no description or items are provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.description.set('');
    fixture.componentInstance.descriptionItems.set([]);
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const descriptionId = `${input.id}-description`;

    const description =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId);

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(description).toBeFalsy();
    expect(describedBy).not.toContain(descriptionId);
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

  it('should display a field-specific validation message', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.messages.set({
      fields: {
        username: {
          required: 'Informe seu nome de usuário.'
        }
      }
    });

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const feedback: HTMLElement =
      fixture.nativeElement.querySelector('.invalid-feedback');

    expect(feedback.textContent).toContain(
      'Informe seu nome de usuário.'
    );
  });

  it('should display the character count when maxLength is configured', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = 'daniel';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const counterId = `${input.id}-character-count`;

    const counter =
      fixture.nativeElement.ownerDocument.getElementById(counterId);

    expect(counter).toBeTruthy();
    expect(counter!.textContent).toContain('6');
    expect(counter!.textContent).toContain('20');

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain(counterId);
  });

  it('should generate unique IDs for fields with the same name', () => {

    const fixture = TestBed.createComponent(DuplicateFieldsHostComponent);

    fixture.detectChanges();

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input')
    ) as HTMLInputElement[];

    expect(inputs).toHaveLength(2);

    expect(inputs[0].id).not.toBe(inputs[1].id);

    expect(new Set(inputs.map(input => input.id)).size).toBe(2);

    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('label')
    ) as HTMLLabelElement[];

    expect(labels[0].htmlFor).toBe(inputs[0].id);
    expect(labels[1].htmlFor).toBe(inputs[1].id);

  });

});