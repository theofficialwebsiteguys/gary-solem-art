import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, Scroll } from '@angular/router';
import { SiteFooterComponent } from './layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from './layout/site-header/site-header.component';
import { ArtworkViewerComponent } from './shared/artwork-viewer/artwork-viewer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, ArtworkViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /** Location.path() is relative to <base href>, so this also works when hosted in a subfolder. */
  protected readonly isHome = signal(inject(Location).path().split(/[?#]/)[0] === '');

  constructor() {
    let firstNavigation = true;
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isHome.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/');
        }
        // Scroll fires after the new page has rendered and the router has scrolled.
        if (event instanceof Scroll) {
          if (firstNavigation) {
            firstNavigation = false;
            return;
          }
          // Anchor links focus their own target; otherwise announce the new page via its heading.
          if (!event.anchor) this.focusPageHeading();
        }
      });
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }

  private focusPageHeading(): void {
    const main = this.main().nativeElement;
    const heading = main.querySelector<HTMLElement>('h1') ?? main;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}
