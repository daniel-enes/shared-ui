import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormSelect } from './form-select';

@Component({
  imports: [FormSelect],
  template: `
    <ui-form-select
      [field]="testForm.country"
      label="País"
      [options]="options"
      placeholder="Selecione um país"
    />
  `
})
class TestHostComponent {
  options = [
    { label: 'Brasil', value: 'BR' },
    { label: 'Finlândia', value: 'FI' },
    { label: 'Indonésia', value: 'ID' }
  ];

  model = signal({
    country: 'BR'
  });

  testForm = form(this.model);
}

describe('FormSelect', () => {
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
    const select = fixture.nativeElement.querySelector('select');

    expect(select).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('País');
  });

  it('should associate the label with the select', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(select.id);
  });

  it('should display the available options', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');

    const options = Array.from(select.options);

    expect(options.some(option =>
      option.value === 'BR' && option.textContent?.includes('Brasil')
    )).toBe(true);

    expect(options.some(option =>
      option.value === 'FI' && option.textContent?.includes('Finlândia')
    )).toBe(true);

    expect(options.some(option =>
      option.value === 'ID' && option.textContent?.includes('Indonésia')
    )).toBe(true);
  });

  it('should display the placeholder', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');

    const placeholder = Array.from(select.options)
      .find(option => option.value === '');

    expect(placeholder).toBeTruthy();
    expect(placeholder!.textContent).toContain('Selecione um país');
  });

  it('should update the model when the user selects an option', async () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('select');

    select.value = 'FI';

    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(select.value).toBe('FI');
    expect(fixture.componentInstance.model().country).toBe('FI');
  });
});