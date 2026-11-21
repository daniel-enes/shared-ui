import { Component, signal } from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  form,
  required,
  minLength
} from '@angular/forms/signals';

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
      description="Utilize pelo menos 8 caracteres."
      fieldName="username"
    />
  `
})
class TestHostComponent {

  model = signal({
    username: ''
  });

  registerForm = form(this.model, (path) => {

    required(path.username);

    minLength(path.username, 8);

  });

}


describe('FormInput', () => {

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
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

  });

  it('should display the placeholder', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.placeholder).toBe('Digite seu username');

  });

  it('should display the description', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const descriptionId = input.getAttribute('aria-describedby');

    const description: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId!);

    expect(description).toBeTruthy();

    expect(description!.textContent).toContain(
      'Utilize pelo menos 8 caracteres.'
    );

  });

  it('should associate the description with the input using aria-describedby', () => {

    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const descriptionId = input.getAttribute('aria-describedby');

    expect(descriptionId).toBeTruthy();

    const description: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId!);

    expect(description).toBeTruthy();

    expect(description!.id).toBe(descriptionId);

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

  });

});