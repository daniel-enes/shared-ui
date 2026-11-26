import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, maxLength, required } from '@angular/forms/signals';

import { FormTextarea } from './form-textarea';

@Component({
  imports: [FormTextarea],
  template: `
    <ui-form-textarea
      [field]="testForm.description"
      label="Descrição"
      placeholder="Digite uma descrição"
      [description]="description()"
      [descriptionItems]="descriptionItems()"
      [rows]="4"
    />
  `
})
class TestHostComponent {
  description = signal('Informe uma descrição detalhada.');

  descriptionItems = signal<readonly string[]>([]);

  model = signal({
    description: ''
  });

  testForm = form(this.model, path => {
    required(path.description);
    maxLength(path.description, 20);
  });
}

describe('FormTextarea', () => {
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
    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
  });

  it('should display the label', () => {
    const label = fixture.nativeElement.querySelector('label');

    expect(label.textContent).toContain('Descrição');
  });

  it('should have an associated label', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(textarea.id);
  });

  it('should display the placeholder', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(textarea.placeholder).toBe('Digite uma descrição');
  });

  it('should apply the configured number of rows', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(textarea.rows).toBe(4);
  });

  // Signal Forms

  it('should update the model when the user types', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    textarea.value = 'Uma descrição válida';

    textarea.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(fixture.componentInstance.model().description)
      .toBe('Uma descrição válida');
  });

  // Description

  it('should display the description', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const descriptionId = `${textarea.id}-description`;

    const description: HTMLElement =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId);

    expect(description).toBeTruthy();

    expect(description.textContent)
      .toContain('Informe uma descrição detalhada.');
  });

  it('should associate the description with the textarea', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const descriptionId = `${textarea.id}-description`;

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain(descriptionId);
  });

  it('should display the description items list', () => {
    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF',
      'Tamanho máximo de 5 MB'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const container: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${textarea.id}-description`
      );

    expect(container).toBeTruthy();
    expect(container.tagName).toBe('DIV');

    const list: HTMLUListElement | null = container!.querySelector('ul');
    expect(list).toBeTruthy();

    const items = list!.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Apenas arquivos PDF');
    expect(items[1].textContent).toContain('Tamanho máximo de 5 MB');
  });

  it('should display only description items without description text', () => {
    fixture.componentInstance.description.set('');
    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF',
      'Tamanho máximo de 5 MB'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const container: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${textarea.id}-description`
      );

    expect(container).toBeTruthy();
    expect(container!.textContent).not.toContain('Informe uma descrição detalhada.');

    const list: HTMLUListElement | null = container!.querySelector('ul');
    expect(list).toBeTruthy();
    expect(list.querySelectorAll('li')).toHaveLength(2);
  });

  it('should display description text before the items list', () => {
    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const container: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${textarea.id}-description`
      );

    expect(container).toBeTruthy();
    expect(container!.innerHTML.indexOf('Informe uma descrição detalhada.'))
      .toBeLessThan(container!.innerHTML.indexOf('<li'));
  });

  it('should not render container when description contains only spaces', () => {
    fixture.componentInstance.description.set('   ');
    fixture.componentInstance.descriptionItems.set([]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const descriptionId = `${textarea.id}-description`;

    const container =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId);

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(container).toBeFalsy();
    expect(describedBy).not.toContain(descriptionId);
  });

  it('should not render container when items contain only empty strings or spaces', () => {
    fixture.componentInstance.description.set('');
    fixture.componentInstance.descriptionItems.set([
      '',
      '   ',
      '\t'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const descriptionId = `${textarea.id}-description`;

    const container =
      fixture.nativeElement.ownerDocument.getElementById(descriptionId);

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(container).toBeFalsy();
    expect(describedBy).not.toContain(descriptionId);
  });

  it('should render only valid items preserving their original order', () => {
    fixture.componentInstance.description.set('');
    fixture.componentInstance.descriptionItems.set([
      '',
      'Primeiro item válido',
      '   ',
      'Segundo item válido',
      '',
      'Terceiro item válido'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const container: HTMLElement | null =
      fixture.nativeElement.ownerDocument.getElementById(
        `${textarea.id}-description`
      );

    expect(container).toBeTruthy();

    const items = container!.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('Primeiro item válido');
    expect(items[1].textContent).toContain('Segundo item válido');
    expect(items[2].textContent).toContain('Terceiro item válido');
  });

  it('should associate the description items list with the textarea using aria-describedby', () => {
    fixture.componentInstance.descriptionItems.set([
      'Apenas arquivos PDF'
    ]);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];
    const descriptionId = describedBy.find((id) => id.endsWith('-description'));

    expect(descriptionId).toBeTruthy();

    const container: HTMLElement | null = fixture.nativeElement
      .ownerDocument.getElementById(descriptionId!);

    expect(container).toBeTruthy();
    expect(container.tagName).toBe('DIV');
    expect(container.querySelector('ul')).toBeTruthy();
    expect(describedBy).toContain(descriptionId!);
  });

  // Validation

  it('should display an error when the field is touched and invalid', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    textarea.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const feedback: HTMLElement =
      fixture.nativeElement.querySelector('.invalid-feedback');

    expect(feedback).toBeTruthy();

    expect(feedback.textContent)
      .toContain('Este campo é obrigatório.');

    expect(textarea.getAttribute('aria-invalid')).toBe('true');

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain(feedback.id);
  });

  // Character count

  it('should display the character count when maxLength is configured', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    const counterId = `${textarea.id}-character-count`;

    const counter: HTMLElement =
      fixture.nativeElement.ownerDocument.getElementById(counterId);

    expect(counter).toBeTruthy();

    expect(counter.textContent).toContain('0');
    expect(counter.textContent).toContain('20');

    const describedBy = textarea.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain(counterId);
  });

  it('should update the character count when the user types', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    textarea.value = 'daniel';

    textarea.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const counterId = `${textarea.id}-character-count`;

    const counter: HTMLElement =
      fixture.nativeElement.ownerDocument.getElementById(counterId);

    expect(counter).toBeTruthy();
    expect(counter.textContent).toContain('6');
    expect(counter.textContent).toContain('20');
  });
});