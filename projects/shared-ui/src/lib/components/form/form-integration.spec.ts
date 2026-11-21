import {
  Component,
  signal,
  WritableSignal
} from '@angular/core';

import { TestBed } from '@angular/core/testing';

import {
  FieldTree,
  form,
  required,
  minLength,
  submit
} from '@angular/forms/signals';

import {
  FormInput,
  FormAlert,
  FormContextDirective
} from 'shared-ui';

@Component({
  standalone: true,
  imports: [
    FormInput,
    FormAlert,
    FormContextDirective
  ],
  template: `
    <form
      uiFormContext
      #formContext="uiFormContext"
      (submit)="onSubmit($event, formContext)"
      novalidate
    >

      <ui-form-alert
        [form]="registerForm"
        [submitted]="submitted()"
      />

      <ui-form-input
        [field]="registerForm.username"
        label="Username"
        fieldName="username"
      />

      <button type="submit">
        Enviar
      </button>

    </form>
  `
})
class TestHostComponent {

  model = signal({
    username: ''
  });

  submitted = signal(false);

  registerForm = form(this.model, (path) => {
    required(path.username);
    minLength(path.username, 8);
  });

  async onSubmit(
    event: Event,
    context: FormContextDirective
  ): Promise<void> {

    event.preventDefault();

    this.submitted.set(true);

    await submit(this.registerForm, {

      action: async () => {
        // Não precisamos executar nenhuma operação neste teste.
      },

      onInvalid: () => {
        context.requestAlertFocus();
      }

    });
  }

}

interface RegisterModel {
  username: string;
}

@Component({
  standalone: true,
  imports: [
    FormInput,
    FormAlert,
    FormContextDirective
  ],
  template: `
    <!-- Primeiro formulário -->
    <form
      id="first-form"
      uiFormContext
      #firstContext="uiFormContext"
      (submit)="onSubmit(
        $event,
        firstForm,
        firstSubmitted,
        firstContext
      )"
      novalidate
    >

      <ui-form-alert
        [form]="firstForm"
        [submitted]="firstSubmitted()"
      />

      <ui-form-input
        [field]="firstForm.username"
        inputId="first-username"
        label="Primeiro username"
        fieldName="username"
      />

      <button type="submit">Enviar primeiro</button>

    </form>

    <!-- Segundo formulário -->
    <form
      id="second-form"
      uiFormContext
      #secondContext="uiFormContext"
      (submit)="onSubmit(
        $event,
        secondForm,
        secondSubmitted,
        secondContext
      )"
      novalidate
    >

      <ui-form-alert
        [form]="secondForm"
        [submitted]="secondSubmitted()"
      />

      <ui-form-input
        [field]="secondForm.username"
        inputId="second-username"
        label="Segundo username"
        fieldName="username"
      />

      <button type="submit">Enviar segundo</button>

    </form>
  `
})
class MultipleFormsHostComponent {

  // Primeiro formulário
  firstModel = signal<RegisterModel>({
    username: ''
  });

  firstSubmitted = signal(false);

  firstForm = form(this.firstModel, (path) => {
    required(path.username);
    minLength(path.username, 8);
  });


  // Segundo formulário
  secondModel = signal<RegisterModel>({
    username: ''
  });

  secondSubmitted = signal(false);

  secondForm = form(this.secondModel, (path) => {
    required(path.username);
    minLength(path.username, 8);
  });


  async onSubmit(
    event: Event,
    formTree: FieldTree<RegisterModel>,
    submitted: WritableSignal<boolean>,
    context: FormContextDirective
  ): Promise<void> {

    event.preventDefault();

    submitted.set(true);

    await submit(formTree, {

      action: async () => {},

      onInvalid: () => {
        context.requestAlertFocus();
      }

    });
  }

}

describe('Form integration', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

    });

    it('should focus FormAlert after an invalid form submission', async () => {

        const fixture = TestBed.createComponent(TestHostComponent);

        fixture.detectChanges();

        const formElement: HTMLFormElement =
            fixture.nativeElement.querySelector('form');

        formElement.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const alert: HTMLElement =
            fixture.nativeElement.querySelector('.form-alert');

        expect(alert).toBeTruthy();

        expect(document.activeElement).toBe(alert);

    }); 

    it('should return focus to FormAlert when the user clicks the summary link', async () => {

        const fixture = TestBed.createComponent(TestHostComponent);

        fixture.detectChanges();

        const formElement: HTMLFormElement =
            fixture.nativeElement.querySelector('form');

        formElement.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const alert: HTMLElement =
            fixture.nativeElement.querySelector('.form-alert');

        const input: HTMLInputElement =
            fixture.nativeElement.querySelector('input');

        const returnButton: HTMLButtonElement =
            fixture.nativeElement.querySelector('.form-input__summary-link');

        expect(returnButton).toBeTruthy();

        // Simula o usuário voltando a interagir com o campo.
        input.focus();

        expect(document.activeElement).toBe(input);

        // Solicita o retorno ao resumo.
        returnButton.click();

        expect(document.activeElement).toBe(alert);

    });

    it('should focus FormAlert again after another invalid submission', async () => {

        const fixture = TestBed.createComponent(TestHostComponent);

        fixture.detectChanges();

        const formElement: HTMLFormElement =
            fixture.nativeElement.querySelector('form');

        const input: HTMLInputElement =
            fixture.nativeElement.querySelector('input');

        // Primeira submissão inválida.
        formElement.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        // O alerta é consultado somente depois de sua renderização.
        const alert: HTMLElement =
            fixture.nativeElement.querySelector('.form-alert');

        expect(alert).toBeTruthy();
        expect(document.activeElement).toBe(alert);

        // Simula o usuário voltando ao campo.
        input.focus();

        expect(document.activeElement).toBe(input);

        // Segunda submissão inválida.
        formElement.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        expect(document.activeElement).toBe(alert);

    });
});

describe('Multiple forms integration', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MultipleFormsHostComponent]
    }).compileComponents();

  });

    it('should keep validation states independent between forms', async () => {

        const fixture = TestBed.createComponent(MultipleFormsHostComponent);

        fixture.detectChanges();

        const firstForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#first-form');

        const secondForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#second-form');

        // Submete somente o primeiro formulário.
        firstForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const firstAlert =
            firstForm.querySelector('.form-alert');

        const secondAlert =
            secondForm.querySelector('.form-alert');

        expect(firstAlert).toBeTruthy();
        expect(secondAlert).toBeFalsy();

        expect(fixture.componentInstance.firstSubmitted()).toBe(true);
        expect(fixture.componentInstance.secondSubmitted()).toBe(false);

    });

    it('should focus the correct alert when each form is submitted', async () => {

        const fixture = TestBed.createComponent(MultipleFormsHostComponent);

        fixture.detectChanges();

        const firstForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#first-form');

        const secondForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#second-form');

        // Submete o primeiro formulário.
        firstForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const firstAlert: HTMLElement =
            firstForm.querySelector('.form-alert')!;

        expect(document.activeElement).toBe(firstAlert);

        // Submete o segundo formulário.
        secondForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const secondAlert: HTMLElement =
            secondForm.querySelector('.form-alert')!;

        expect(document.activeElement).toBe(secondAlert);

        // O primeiro resumo continua existindo.
        expect(firstForm.querySelector('.form-alert')).toBe(firstAlert);

    });

    it('should return focus to the correct alert when multiple forms are visible', async () => {

        const fixture = TestBed.createComponent(MultipleFormsHostComponent);

        fixture.detectChanges();

        const firstForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#first-form');

        const secondForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#second-form');

        // Submete os dois formulários.
        firstForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        secondForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();

        await fixture.whenStable();

        const firstAlert: HTMLElement =
            firstForm.querySelector('.form-alert')!;

        const secondInput: HTMLInputElement =
            secondForm.querySelector('input')!;

        const firstReturnButton: HTMLButtonElement =
            firstForm.querySelector('.form-input__summary-link')!;

        // Move o foco para o segundo formulário.
        secondInput.focus();

        expect(document.activeElement).toBe(secondInput);

        // Solicita o retorno ao resumo do primeiro formulário.
        firstReturnButton.click();

        expect(document.activeElement).toBe(firstAlert);

    });

    it('should have unique title IDs when multiple alerts are displayed', async () => {

        const fixture = TestBed.createComponent(MultipleFormsHostComponent);

        fixture.detectChanges();

        const firstForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#first-form');

        const secondForm: HTMLFormElement =
            fixture.nativeElement.querySelector('#second-form');

        // Exibe o primeiro alerta.
        firstForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();
        await fixture.whenStable();

        // Exibe o segundo alerta.
        secondForm.dispatchEvent(
            new Event('submit', {
            bubbles: true,
            cancelable: true
            })
        );

        fixture.detectChanges();
        await fixture.whenStable();

        const firstAlert: HTMLElement =
            firstForm.querySelector('.form-alert')!;

        const secondAlert: HTMLElement =
            secondForm.querySelector('.form-alert')!;

        const firstTitle: HTMLElement =
            firstAlert.querySelector('h2')!;

        const secondTitle: HTMLElement =
            secondAlert.querySelector('h2')!;

        expect(firstTitle.id).not.toBe(secondTitle.id);

        expect(firstAlert.getAttribute('aria-labelledby'))
            .toBe(firstTitle.id);

        expect(secondAlert.getAttribute('aria-labelledby'))
            .toBe(secondTitle.id);

    });


});