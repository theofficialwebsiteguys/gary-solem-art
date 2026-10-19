import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NOT_FOUND } from '../../content/page-copy';
import { MAIN_NAV } from '../../content/site.config';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="missing container">
      <p class="eyebrow">Page not found</p>
      <h1 tabindex="-1">{{ copy.title }}</h1>
      <span class="rule" aria-hidden="true"></span>
      <p class="lead">{{ copy.body }}</p>
      <nav aria-label="Pages on this site">
        <ul class="missing__links" role="list">
          @for (item of nav; track item.path) {
            <li>
              <a class="text-link" [routerLink]="item.path">
                <span>{{ item.label }}</span>
                <app-icon name="arrow-right" />
              </a>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
  styles: `
    .missing {
      padding-block: clamp(3rem, 9vw, 7rem) var(--section-space);
    }
    .missing__links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 2.5rem;
      margin: 2.5rem 0 0;
      padding: 0;
      list-style: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {
  protected readonly copy = NOT_FOUND;
  protected readonly nav = MAIN_NAV;
}
