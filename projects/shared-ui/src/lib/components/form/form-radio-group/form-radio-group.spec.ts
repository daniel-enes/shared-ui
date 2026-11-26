import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormRadioGroup } from './form-radio-group';

@Component({
  imports: [FormRadioGroup],
  template: `
    <ui-form-radio-group
      [field]="testForm.gender"
      label="Gênero"
      [options]="options"
      [description]="description()"
      [descriptionItems]="descriptionItems()"
    />
  `
})
class TestHostComponent {
  options = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Outro', value: 'O' }
  ];

  description = signal('Selecione uma opção.');

  descriptionItems = signal<readonly string[]>(['Item 1', 'Item 2']);

  model = signal({
    gender: 'M'
  });

  testForm = form(this.model);
}

describe('FormRadioGroup', () => {
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

  it('should display the group label', () => {
    const legend: HTMLLegendElement =
      fixture.nativeElement.querySelector('legend');

    expect(legend).toBeTruthy();
    expect(legend.textContent).toContain('Gênero');
  });

  it('should display all available options', () => {
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('label')
    ) as HTMLLabelElement[];

    expect(labels.some(label => label.textContent?.includes('Masculino')))
      .toBe(true);

    expect(labels.some(label => label.textContent?.includes('Feminino')))
      .toBe(true);

    expect(labels.some(label => label.textContent?.includes('Outro')))
      .toBe(true);
  });

  it('should associate each label with its radio input', () => {
    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];

    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('label')
    ) as HTMLLabelElement[];

    expect(inputs.length).toBe(3);

    for (const input of inputs) {
      const associatedLabel = labels.find(
        label => label.htmlFor === input.id
      );

      expect(associatedLabel).toBeTruthy();
    }
  });

  it('should select the initial value from the model', () => {
    const selected: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="radio"]:checked');

    expect(selected).toBeTruthy();
    expect(selected.value).toBe('M');
  });

  it('should update the model when the user selects another option', async () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    const radios = Array.from(
      nativeElement.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];

    const radio = radios.find(input => input.value === 'F');

    expect(radio).toBeTruthy();

    radio!.checked = true;

    radio!.dispatchEvent(new Event('input', { bubbles: true }));
    radio!.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().gender).toBe('F');
    expect(typeof fixture.componentInstance.model().gender).toBe('string');
  });

  it('should keep only one option selected', async () => {
    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];

    radios[1].checked = true;

    radios[1].dispatchEvent(new Event('input', { bubbles: true }));
    radios[1].dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();
    const selectedRadios = radios.filter(radio => radio.checked);

    expect(selectedRadios.length).toBe(1);
    expect(selectedRadios[0].value).toBe('F');
  });

  it('should associate the description container with the radio group using aria-describedby', () => {
    const fieldset: HTMLFieldSetElement =
      fixture.nativeElement.querySelector('fieldset');

    const describedBy = fieldset.getAttribute('aria-describedby')?.split(' ') ?? [];
    const descriptionId = describedBy.find((id) => id.endsWith('-description'));

    expect(descriptionId).toBeTruthy();

    const container: HTMLElement | null = fixture.nativeElement
      .ownerDocument.getElementById(descriptionId!);

    expect(container).toBeTruthy();
    expect(container.tagName).toBe('DIV');
    expect(container.querySelector('ul')).toBeTruthy();
    expect(describedBy).toContain(descriptionId!);
  });

});
