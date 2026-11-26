import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldGroup } from './form-field-group';

@Component({
  imports: [FormFieldGroup],
  template: `
    <ui-form-field-group
      label="Informações pessoais"
      [description]="description()"
    >
      <input
        id="firstName"
        type="text"
        aria-label="Nome"
      />

      <input
        id="lastName"
        type="text"
        aria-label="Sobrenome"
      />
    </ui-form-field-group>
  `
})
class TestHostComponent {
  description = signal(
    'Preencha os dados pessoais solicitados.'
  );
}

describe('FormFieldGroup', () => {
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
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    expect(fieldset).toBeTruthy();
  });

  it('should render a fieldset element', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    expect(fieldset.tagName).toBe('FIELDSET');
  });

  it('should display the legend', () => {
    const legend: HTMLLegendElement =
      fixture.nativeElement.querySelector('legend');

    expect(legend).toBeTruthy();
    expect(legend.textContent).toContain('Informações pessoais');
  });

  it('should associate the legend with the fieldset', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    const legend: HTMLLegendElement =
      fieldset.querySelector('legend')!;

    expect(legend).toBeTruthy();
    expect(legend.parentElement).toBe(fieldset);
  });

  it('should display the description', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent)
      .toContain('Preencha os dados pessoais solicitados.');
  });

  it('should update the description when its signal changes', async () => {
    fixture.componentInstance.description.set(
      'Informe seu nome e sobrenome.'
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent)
      .toContain('Informe seu nome e sobrenome.');

    expect(nativeElement.textContent)
      .not.toContain('Preencha os dados pessoais solicitados.');
  });

  it('should project child controls into the fieldset', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    const inputs = fieldset.querySelectorAll('input');

    expect(inputs.length).toBe(2);
  });

  it('should preserve the attributes of projected controls', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    const firstName: HTMLInputElement =
      fieldset.querySelector('#firstName')!;

    const lastName: HTMLInputElement =
      fieldset.querySelector('#lastName')!;

    expect(firstName.getAttribute('aria-label')).toBe('Nome');
    expect(lastName.getAttribute('aria-label')).toBe('Sobrenome');
  });

  it('should keep projected controls inside the same fieldset', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    const firstName: HTMLInputElement =
      fieldset.querySelector('#firstName')!;

    const lastName: HTMLInputElement =
      fieldset.querySelector('#lastName')!;

    expect(fieldset.contains(firstName)).toBe(true);
    expect(fieldset.contains(lastName)).toBe(true);
  });
});
