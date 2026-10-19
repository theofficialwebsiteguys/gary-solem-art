import { DOCUMENT, Location } from '@angular/common';
import { Directive, computed, inject, input } from '@angular/core';

/**
 * In-page link to an element id. Plain href="#id" links would resolve against <base href="/">
 * and leave the page, so this scrolls in place (smoothly unless the visitor prefers reduced
 * motion), moves focus to the target and records the #fragment in the address bar.
 */
@Directive({
  selector: 'a[appScrollTo]',
  host: {
    '[attr.href]': 'href()',
    '(click)': 'onClick($event)',
  },
})
export class ScrollToDirective {
  readonly target = input.required<string>({ alias: 'appScrollTo' });

  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);

  /** Includes the <base href>, so "open in new tab" works when the site is hosted in a subfolder. */
  protected readonly href = computed(() => `${this.location.prepareExternalUrl(this.location.path(false))}#${this.target()}`);

  protected onClick(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const el = this.document.getElementById(this.target());
    if (!el) return;
    event.preventDefault();
    const reduce = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? true;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    this.location.replaceState(this.location.path(false) + '#' + this.target());
  }
}
