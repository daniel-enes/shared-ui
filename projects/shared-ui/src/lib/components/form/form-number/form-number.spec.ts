import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormNumber } from './form-number';

@Component({
  imports: [FormNumber],
  template: `
    <ui-form-number
      [field]="testForm.age"
      label="Idade"
      placeholder="Informe sua idade"
    />
  `
})
class TestHostComponent {
  model = signal({
    age: 25
  });

  testForm = form(this.model);
}

describe('FormNumber', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="number"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Idade');
  });

  it('should associate the label with the input', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should display the placeholder', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.placeholder).toBe('Informe sua idade');
  });

  it('should display the initial value from the model', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('25');
  });

  it('should update the model when the user enters a number', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = '42';

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().age).toBe(42);
    expect(typeof fixture.componentInstance.model().age).toBe('number');
  });
});
