import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME } from '../../content/page-copy';
import { IconComponent } from '../icon/icon.component';

/** Quiet "continue exploring" links to the other collection pages. */
@Component({
  selector: 'app-collection-links',
  imports: [RouterLink, IconComponent],
  template: `
    <nav class="more container" aria-labelledby="more-heading">
      <h2 id="more-heading" class="eyebrow">Continue exploring</h2>
      <ul class="more__list" role="list">
        @for (item of others(); track item.path) {
          <li>
            <a class="more__link" [routerLink]="item.path">
              <span class="more__label">{{ item.label }}</span>
              <span class="more__desc">{{ item.description }}</span>
              <app-icon name="arrow-right" class="more__arrow" />
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      padding-bottom: var(--section-space);
    }
    .more {
      border-top: 1px solid var(--line);
      padding-top: 3rem;
    }
    .more__list {
      display: grid;
      gap: 0 3rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .more__link {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.25rem 1.5rem;
      padding-block: 1.25rem;
      border-bottom: 1px solid var(--line);
      text-decoration: none;
    }
    .more__label {
      color: var(--ink);
      font-family: var(--font-serif);
      font-size: clamp(1.6rem, 2.6vw, 2rem);
      line-height: 1.2;
    }
    .more__desc {
      grid-row: 2;
      color: var(--slate);
      font-size: 0.9375rem;
    }
    .more__arrow {
      grid-row: 1 / span 2;
      grid-column: 2;
      color: var(--ochre-text);
      transition: transform 0.3s var(--ease);
    }
    .more__link:hover .more__arrow,
    .more__link:focus-visible .more__arrow {
      transform: translateX(4px);
    }
    .more__link:hover .more__label {
      text-decoration: underline;
      text-decoration-color: var(--ochre);
      text-decoration-thickness: 1px;
    }
    @media (min-width: 800px) {
      .more__list {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionLinksComponent {
  /** Route of the current page, which is left out of the list. */
  readonly current = input.required<string>();
  protected readonly others = computed(() => HOME.explore.items.filter((item) => item.path !== this.current()));
}
