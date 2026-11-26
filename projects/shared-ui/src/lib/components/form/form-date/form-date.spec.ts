import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormDate } from './form-date';

@Component({
  imports: [FormDate],
  template: `
    <ui-form-date
      [field]="testForm.birthDate"
      label="Data de nascimento"
      placeholder="Selecione uma data"
    />
  `
})
class TestHostComponent {
  model = signal({
    birthDate: '2000-05-15'
  });

  testForm = form(this.model);
}

describe('FormDate', () => {
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
      fixture.nativeElement.querySelector('input[type="date"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Data de nascimento');
  });

  it('should associate the label with the input', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should display the initial date from the model', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('2000-05-15');
  });

  it('should update the model when the user selects a date', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = '2020-08-25';

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().birthDate)
      .toBe('2020-08-25');

    expect(typeof fixture.componentInstance.model().birthDate)
      .toBe('string');
  });
});
