import { Component, signal } from '@angular/core';

import { provideRouter } from '@angular/router';

import { TestBed } from '@angular/core/testing';

import { UiButtonLink } from './button-link';

@Component({
  standalone: true,
  imports: [UiButtonLink],
  template: `
    <ui-button-link
      [text]="text()"
      [icon]="icon()"
      [variant]="variant()"
      [size]="size()"
      [routerLink]="routerLink()"
      [queryParams]="queryParams()"
      [fragment]="fragment()"
      [target]="target()"
      [rel]="rel()"
      [replaceUrl]="replaceUrl()"
      [ariaLabel]="ariaLabel()"
      [title]="title()"
      [fullWidth]="fullWidth()"
      (clicked)="handleClick()"
    />
  `
})
class TestHostComponent {

  text = signal('Visualizar usuário');

  icon = signal('bi bi-eye');

  variant = signal<'primary' | 'outline-primary'>('primary');

  size = signal<'sm' | 'lg' | undefined>(undefined);

  routerLink = signal<string | readonly unknown[] | null | undefined>(['/users', 1]);

  queryParams = signal<Record<string, unknown> | null>(null);

  fragment = signal('');

  target = signal('');

  rel = signal('');

  replaceUrl = signal(false);

  ariaLabel = signal('');

  title = signal('');

  fullWidth = signal(false);

  clicks = signal(0);

  handleClick(): void {
    this.clicks.update((value) => value + 1);
  }

}

describe('UiButtonLink', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([{ path: '**', children: [] }])]
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const link =
      fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    return { fixture, link };
  }

  it('should create the component rendering an anchor', () => {
    const { link } = createFixture();

    expect(link).toBeTruthy();
    expect(link.tagName).toBe('A');
  });

  it('should apply the routerLink to the anchor', () => {
    const { link } = createFixture();

    expect(link.getAttribute('href')).toBe('/users/1');
  });

  it('should map the variant to a bootstrap class', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.variant.set('outline-primary');
    fixture.detectChanges();

    expect(link.classList).toContain('btn');
    expect(link.classList).toContain('btn-outline-primary');
  });

  it('should apply the size class when configured', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();

    expect(link.classList).toContain('btn-sm');
  });

  it('should not force layout classes by default', () => {
    const { link } = createFixture();

    expect(link.classList).not.toContain('w-100');
    expect(link.classList).not.toContain('me-1');
    expect(link.classList).not.toContain('p-2');
  });

  it('should render the icon and the text', () => {
    const { link } = createFixture();

    const icon = link.querySelector('i');

    expect(icon).toBeTruthy();
    expect(icon!.classList).toContain('bi-eye');
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
    expect(link.textContent).toContain('Visualizar usuário');
  });

  it('should not be given a redundant tabindex', () => {
    const { link } = createFixture();

    expect(link.getAttribute('tabindex')).toBeNull();
  });

  it('should use ariaLabel as the accessible name for icon-only links', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Editar usuário');
    fixture.detectChanges();

    expect(link.getAttribute('aria-label')).toBe('Editar usuário');
  });

  it('should fall back to ariaLabel for the title attribute', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Editar usuário');
    fixture.detectChanges();

    expect(link.getAttribute('title')).toBe('Editar usuário');
  });

  it('should give priority to an explicit title over ariaLabel', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.text.set('');
    fixture.componentInstance.ariaLabel.set('Editar usuário');
    fixture.componentInstance.title.set('Dica visual');
    fixture.detectChanges();

    expect(link.getAttribute('title')).toBe('Dica visual');
    expect(link.getAttribute('aria-label')).toBe('Editar usuário');
  });

  it('should emit clicked when the link is activated', async () => {
    const { fixture, link } = createFixture();

    link.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks()).toBe(1);
  });

  it('should apply the full width class when configured', () => {
    const { fixture, link } = createFixture();

    expect(link.classList).not.toContain('w-100');

    fixture.componentInstance.fullWidth.set(true);
    fixture.detectChanges();

    expect(link.classList).toContain('w-100');
  });

  it('should pass through target and rel when configured', () => {
    const { fixture, link } = createFixture();

    fixture.componentInstance.target.set('_blank');
    fixture.componentInstance.rel.set('noopener');
    fixture.detectChanges();

    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
  });

});