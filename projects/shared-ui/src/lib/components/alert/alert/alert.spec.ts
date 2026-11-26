import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UiAlert } from './alert';

@Component({
  standalone: true,
  imports: [UiAlert],
  template: `
    <ui-alert
      [title]="title()"
      [message]="message()"
      [variant]="variant()"
      [visible]="visible()"
      [dismissible]="dismissible()"
      (dismissed)="handleDismiss()"
    />
  `
})
class TestHostComponent {

  title = signal('Operação realizada');

  message = signal('As alterações foram salvas com sucesso.');

  variant = signal<'success' | 'info' | 'warning' | 'danger'>('success');

  visible = signal(false);

  dismissible = signal(false);

  dismisses = signal(0);

  handleDismiss(): void {
    this.dismisses.update((value) => value + 1);
  }

}

describe('UiAlert', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('ui-alert') as HTMLElement;
    const element = alert.querySelector('.ui-alert');

    return { fixture, alert, element };
  }

  it('should create the component', () => {
    const { alert } = createFixture();

    expect(alert).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { element } = createFixture();

    expect(element).toBeFalsy();
  });

  it('should render when visible is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.ui-alert');

    expect(element).toBeTruthy();
  });

  it('should render the message', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.textContent).toContain('As alterações foram salvas com sucesso.');
  });

  it('should not render the title when not provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.title.set('');
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.querySelector('h5')).toBeFalsy();
  });

  it('should render the title when provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    const heading = element.querySelector('h5');

    expect(heading).toBeTruthy();
    expect(heading!.textContent).toContain('Operação realizada');
  });

  it('should apply the bootstrap variant class', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.variant.set('danger');
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.classList).toContain('alert');
    expect(element.classList).toContain('alert-danger');
  });

  it('should not apply dismissible classes when not dismissible', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.classList).not.toContain('alert-dismissible');
    expect(element.querySelector('.btn-close')).toBeFalsy();
  });

  it('should render the dismiss button when dismissible', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.dismissible.set(true);
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    const close = element.querySelector('.btn-close');

    expect(close).toBeTruthy();
    expect(close!.getAttribute('aria-label')).toBe('Fechar');
  });

  it('should emit dismissed when the close button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.componentInstance.dismissible.set(true);
    fixture.detectChanges();

    const close: HTMLButtonElement =
      fixture.nativeElement.querySelector('.btn-close');

    close.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismisses()).toBe(1);
  });

  it('should have role status and polite live region', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  it('should have tabindex -1', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.getAttribute('tabindex')).toBe('-1');
  });

  it('should receive programmatic focus when it becomes visible', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    await fixture.whenStable();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(document.activeElement).toBe(element);
  });

  it('should not receive focus when not visible', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(false);
    fixture.detectChanges();

    await fixture.whenStable();

    const element = fixture.nativeElement.querySelector('.ui-alert');

    expect(element).toBeFalsy();
    expect(document.activeElement).not.toBe(element);
  });

  it('should receive focus again when the content changes while visible', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.componentInstance.title.set('Título antigo');
    fixture.componentInstance.message.set('Mensagem antiga');
    fixture.detectChanges();

    await fixture.whenStable();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(document.activeElement).toBe(element);

    // O usuário navega para outro elemento.
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    expect(document.activeElement).toBe(input);

    // O conteúdo muda enquanto o alerta continua visível.
    fixture.componentInstance.title.set('Título novo');
    fixture.componentInstance.message.set('Mensagem nova');
    fixture.detectChanges();

    await fixture.whenStable();

    expect(document.activeElement).toBe(element);

    document.body.removeChild(input);
  });

  it('should associate the title with the alert through aria-labelledby', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    const heading: HTMLElement = element.querySelector('h5')!;

    expect(element.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('should not set aria-labelledby when title is not provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);

    fixture.componentInstance.title.set('');
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement.querySelector('.ui-alert');

    expect(element.getAttribute('aria-labelledby')).toBeNull();
  });

});
