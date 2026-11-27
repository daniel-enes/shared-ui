import { Component, inject, signal, AfterViewInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-page-toc',
  imports: [],
  standalone: true,
  styleUrl: './page-toc.component.scss',
  templateUrl: './page-toc.component.html',
})
export class PageTocComponent implements AfterViewInit {

  private readonly destroyRef = inject(DestroyRef);

  readonly sections = signal<Array<{ id: string; text: string; level: number }>>([]);

  readonly activeSection = signal<string | null>(null);

  readonly isOpen = signal(false);

  ngAfterViewInit(): void {

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.scanHeadings();

    const observer = new IntersectionObserver(
      (entries) => {

        for (const entry of entries) {

          if (entry.isIntersecting && entry.target.id) {

            this.activeSection.set(entry.target.id);

            break;
          }
        }
      },
      { rootMargin: '-100px 0% -70% 0%', threshold: 0.1 }
    );

    document.querySelectorAll('h2[id], h3[id]').forEach((el) => observer.observe(el));

    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private scanHeadings(): void {

    const headings = document.querySelectorAll('h2[id], h3[id]');

    const items = Array.from(headings).map((el) => ({

      id: el.id,

      text: el.textContent.trim(),

      level: el.tagName === 'H2' ? 2 : 3,

    }));

    this.sections.set(items);
  }

  toggleMenu(): void {

    this.isOpen.update((value) => !value);
  }

  scrollTo(sectionId: string): void {

    const element = document.getElementById(sectionId);

    if (element) {

      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      this.isOpen.set(false);
    }
  }

  isActive(sectionId: string): boolean {

    return this.activeSection() === sectionId;
  }

}
