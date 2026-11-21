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

});