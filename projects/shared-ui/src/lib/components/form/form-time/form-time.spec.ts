import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormTime } from './form-time';

@Component({
  imports: [FormTime],
  template: `
    <ui-form-time
      [field]="testForm.startTime"
      label="Horário de início"
    />
  `
})
class TestHostComponent {
  model = signal({
    startTime: '09:30'
  });

  testForm = form(this.model);
}

describe('FormTime', () => {
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
      fixture.nativeElement.querySelector('input[type="time"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Horário de início');
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

    expect(input.value).toBe('09:30');
  });

  it('should update the model when the user selects a time', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = '14:45';

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().startTime).toBe('14:45');
    expect(typeof fixture.componentInstance.model().startTime).toBe('string');
  });
});
