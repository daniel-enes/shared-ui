import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { FormSwitch } from './form-switch';

@Component({
  imports: [FormSwitch],
  template: `
    <ui-form-switch
      [field]="testForm.notifications"
      label="Receber notificações"
      [description]="description()"
      [descriptionItems]="descriptionItems()"
    />
  `
})
class TestHostComponent {
  model = signal({
    notifications: false
  });

  description = signal('Ative para receber notificações.');

  descriptionItems = signal<readonly string[]>(['Item 1', 'Item 2']);

  testForm = form(this.model);
}

describe('FormSwitch', () => {
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
    expect(label.textContent).toContain('Receber notificações');
  });

  it('should associate the label with the input', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const label: HTMLLabelElement =
      fixture.nativeElement.querySelector('label');

    expect(label.htmlFor).toBe(input.id);
  });

  it('should have the switch role', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.getAttribute('role')).toBe('switch');
  });

  it('should associate the description container with the switch using aria-describedby', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    const descriptionId = describedBy.find((id) => id.endsWith('-description'));

    expect(descriptionId).toBeTruthy();

    const container: HTMLElement | null = fixture.nativeElement
      .ownerDocument.getElementById(descriptionId!);

    if (!container) {
      throw new Error('Description container was not found');
    }
    expect(container.tagName).toBe('DIV');
    expect(container.querySelector('ul')).toBeTruthy();
    expect(describedBy).toContain(descriptionId!);
  });

  it('should reflect the initial value from the model', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.checked).toBe(false);
  });

  it('should update the model when the switch is activated', async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.checked = true;

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.model().notifications).toBe(true);
    expect(typeof fixture.componentInstance.model().notifications)
      .toBe('boolean');
  });

  it('should update the model when the switch is deactivated', async () => {
    fixture.componentInstance.model.set({
      notifications: true
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

    expect(fixture.componentInstance.model().notifications).toBe(false);
  });
});
