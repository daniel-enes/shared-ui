import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormCheckbox } from './form-checkbox';

@Component({
  imports: [FormCheckbox],
  template: `
    <ui-form-checkbox
      [field]="testForm.acceptTerms"
      label="Aceito os termos de uso"
    />
  `
})
class TestHostComponent {
  model = signal({
    acceptTerms: false
  });

  testForm = form(this.model);
}

describe('FormCheckbox', () => {
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
      fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Aceito os termos de uso');
  });

  it('should associate the label with the checkbox', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should reflect the initial value from the model', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.checked).toBe(false);
  });

  it('should update the model when the checkbox is checked', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.checked = true;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().acceptTerms).toBe(true);
    expect(typeof fixture.componentInstance.model().acceptTerms).toBe('boolean');
  });

  it('should update the model when the checkbox is unchecked', async () => {
    fixture.componentInstance.model.set({
      acceptTerms: true
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.checked).toBe(true);

    input.checked = false;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().acceptTerms).toBe(false);
  });
});
