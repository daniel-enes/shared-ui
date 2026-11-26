import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { FormFile } from './form-file';

@Component({
  imports: [FormFile, FormField],
  template: `
    <ui-form-file
      [formField]="testForm.attachment"
      label="Documento"
      accept=".pdf"
    />
  `
})
class TestHostComponent {
  model = signal<{ attachment: File | null }>({
    attachment: null
  });

  testForm = form(this.model);
}

describe('FormFile', () => {
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
      fixture.nativeElement.querySelector('input[type="file"]');

    expect(input).toBeTruthy();
  });

  it('should display the label', () => {
    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Documento');
  });

  it('should associate the label with the input', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should configure the accepted file types', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    expect(input.accept).toBe('.pdf');
  });

  it('should have null as the initial model value', () => {
    expect(fixture.componentInstance.model().attachment).toBeNull();
  });

  it('should update the model when the user selects a file', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    const file = new File(
      ['Conteúdo de teste'],
      'documento.pdf',
      { type: 'application/pdf' }
    );

    Object.defineProperty(input, 'files', {
      value: createFileList(file),
      configurable: true
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    const selectedFile =
      fixture.componentInstance.model().attachment;

    expect(selectedFile).toBeInstanceOf(File);
    expect(selectedFile?.name).toBe('documento.pdf');
    expect(selectedFile?.type).toBe('application/pdf');
  });

  it('should display the selected file name', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    const file = new File(
      ['Conteúdo de teste'],
      'documento.pdf',
      { type: 'application/pdf' }
    );

    Object.defineProperty(input, 'files', {
      value: createFileList(file),
      configurable: true
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('documento.pdf');
  });

  function createFileList(file: File): FileList {
    return {
      0: file,
      length: 1,
      item(index: number): File | null {
        return index === 0 ? file : null;
      }
    } as unknown as FileList;
  }

  it('should clear the selected file when the model becomes null', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    const file = new File(
      ['Conteúdo de teste'],
      'documento.pdf',
      { type: 'application/pdf' }
    );

    Object.defineProperty(input, 'files', {
      value: createFileList(file),
      configurable: true
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().attachment).toBeInstanceOf(File);

    fixture.componentInstance.model.set({
      attachment: null
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.model().attachment).toBeNull();
    expect(input.value).toBe('');
  });

  it('should focus the native input when focus is called', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    const component = fixture.debugElement
      .query(By.directive(FormFile))
      .componentInstance as FormFile;

    component.focus();

    expect(document.activeElement).toBe(input);
  });



});
