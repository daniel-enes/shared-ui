import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormDateTime } from './form-date-time';

@Component({
  imports: [FormDateTime],
  template: `
    <ui-form-datetime
      [field]="testForm.appointment"
      label="Data e horário da consulta"
    />
  `
})
class TestHostComponent {
  model = signal({
    appointment: '2026-12-15T14:30'
  });

  testForm = form(this.model);
}

describe('FormDateTime', () => {
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
      fixture.nativeElement.querySelector('input[type="datetime-local"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Data e horário da consulta');
  });

  it('should associate the label with the input', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should display the initial value from the model', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('2026-12-15T14:30');
  });

  it('should update the model when the user selects a date and time', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = '2027-01-20T16:45';

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().appointment)
      .toBe('2027-01-20T16:45');

    expect(typeof fixture.componentInstance.model().appointment)
      .toBe('string');
  });
});
