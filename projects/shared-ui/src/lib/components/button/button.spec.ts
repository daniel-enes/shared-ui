import { Component, signal } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { UiButton } from './button';

@Component({
  standalone: true,
  imports: [UiButton],
  template: `
    <ui-button
      [text]="text()"
      [icon]="icon()"
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [loading]="loading()"
      [loadingMessage]="loadingMessage()"
      [disabled]="disabled()"
      [ariaLabel]="ariaLabel()"
      [title]="title()"
      [fullWidth]="fullWidth()"
      (clicked)="handleClick()"
    />
  `
})
class TestHostComponent {

  text = signal('Salvar');

  icon = signal('bi bi-save');

  variant = signal<'primary' | 'danger' | 'outline-secondary'>('primary');

  size = signal<'sm' | 'lg' | undefined>(undefined);

  type = signal<'button' | 'submit'>('button');

  loading = signal(false);

  loadingMessage = signal('Carregando...');

  disabled = signal(false);

  ariaLabel = signal('');

  title = signal('');

  fullWidth = signal(false);

  clicks = signal(0);

  handleClick(): void {
    this.clicks.update((value) => value + 1);
  }

}

describe('UiButton', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const button =
      fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    return { fixture, button };
  }

  it('should create the component', () => {
    const { button } = createFixture();

    expect(button).toBeTruthy();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should default to type button', () => {
    const { button } = createFixture();

    expect(button.type).toBe('button');
  });

  it('should render a submit type when configured', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.type.set('submit');
    fixture.detectChanges();

    expect(button.type).toBe('submit');
  });

  it('should map the variant to a bootstrap class', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.variant.set('danger');
    fixture.detectChanges();

    expect(button.classList).toContain('btn');
    expect(button.classList).toContain('btn-danger');
  });

  it('should apply the size class when configured', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    expect(button.classList).toContain('btn-lg');
  });

  it('should not apply a size class by default', () => {
    const { button } = createFixture();

    expect(button.classList).not.toContain('btn-sm');
    expect(button.classList).not.toContain('btn-lg');
  });

  it('should render the icon and the text', () => {
    const { button } = createFixture();

    const icon = button.querySelector('i');

    expect(icon).toBeTruthy();
    expect(icon!.classList).toContain('bi-save');
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
    expect(button.textContent).toContain('Salvar');
  });

  it('should not render the icon when it is not provided', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.icon.set('');
    fixture.detectChanges();

    expect(button.querySelector('i')).toBeFalsy();
  });

  it('should expose an accessible name from the visible text', () => {
    const { button } = createFixture();

    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.textContent).toContain('Salvar');
  });

  it('should use ariaLabel as the accessible name for icon-only buttons', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Remover usuário');
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Remover usuário');
  });

  it('should fall back to ariaLabel for the title attribute', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Remover usuário');
    fixture.detectChanges();

    expect(button.getAttribute('title')).toBe('Remover usuário');
  });

  it('should give priority to an explicit title over ariaLabel', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Remover usuário');
    fixture.componentInstance.title.set('Dica visual');
    fixture.detectChanges();

    expect(button.getAttribute('title')).toBe('Dica visual');
    expect(button.getAttribute('aria-label')).toBe('Remover usuário');
  });

  it('should not set a title when neither title nor ariaLabel are provided', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('');
    fixture.detectChanges();

    expect(button.getAttribute('title')).toBeNull();
  });

  it('should emit clicked when the button is activated', () => {
    const { fixture, button } = createFixture();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks()).toBe(1);
  });

  it('should not emit clicked when disabled', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    button.click();
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(fixture.componentInstance.clicks()).toBe(0);
  });

  it('should expose the loading state accessibly', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.loading.set(true);
    fixture.componentInstance.loadingMessage.set('Enviando...');
    fixture.detectChanges();

    const status = button.querySelector('[role="status"]');

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(status).toBeTruthy();
    expect(status!.getAttribute('aria-live')).toBe('polite');
    expect(status!.textContent).toContain('Enviando...');

    const spinner = button.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();
    expect(spinner!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should hide the icon and text while loading', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    expect(button.querySelector('i')).toBeFalsy();
    expect(button.textContent).not.toContain('Salvar');
  });

  it('should not emit clicked while loading', () => {
    const { fixture, button } = createFixture();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks()).toBe(0);
  });

  it('should make the host full width and stretch the inner button when configured', () => {
    const { fixture, button } = createFixture();

    const host = fixture.nativeElement.querySelector('ui-button') as HTMLElement;

    expect(host.classList).not.toContain('ui-button--full-width');
    expect(window.getComputedStyle(host).display).toBe('inline-block');
    expect(button.classList).not.toContain('w-100');

    fixture.componentInstance.fullWidth.set(true);
    fixture.detectChanges();

    expect(host.classList).toContain('ui-button--full-width');
    expect(window.getComputedStyle(host).display).toBe('block');
    expect(button.classList).toContain('w-100');
  });

  it('should not force layout classes by default', () => {
    const { button } = createFixture();

    expect(button.classList).not.toContain('w-100');
    expect(button.classList).not.toContain('me-1');
    expect(button.classList).not.toContain('p-2');
  });

});