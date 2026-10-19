import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME } from '../../content/page-copy';
import { MAIN_NAV, SITE } from '../../content/site.config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <a class="footer__wordmark" routerLink="/">{{ site.name }}</a>
          <p class="footer__tagline">{{ tagline }}</p>
        </div>
        <nav aria-label="Footer">
          <ul class="footer__nav" role="list">
            @for (item of nav; track item.path) {
              <li><a [routerLink]="item.path">{{ item.label }}</a></li>
            }
          </ul>
        </nav>
      </div>
      <div class="container">
        <p class="footer__legal">© {{ year }} {{ site.name }}</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      padding-block: clamp(3rem, 6vw, 4.5rem) 2rem;
      background: var(--footer-mist);
    }
    .footer__inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2rem 3rem;
      padding-bottom: 2.5rem;
    }
    .footer__wordmark {
      color: var(--ink);
      font-family: var(--font-serif);
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-decoration: none;
      text-transform: uppercase;
    }
    .footer__tagline {
      margin: 0.6rem 0 0;
      font-size: 0.9375rem;
    }
    .footer__nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 2rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .footer__nav a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-size: 0.9375rem;
      text-decoration: none;
    }
    .footer__nav a:hover {
      text-decoration: underline;
      text-decoration-color: var(--ochre);
    }
    .footer__legal {
      margin: 0;
      padding-top: 1.5rem;
      border-top: 1px solid var(--line);
      font-size: 0.8125rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly site = SITE;
  protected readonly nav = MAIN_NAV;
  protected readonly tagline = HOME.hero.lead;
  protected readonly year = new Date().getFullYear();
}
