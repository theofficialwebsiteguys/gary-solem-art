import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Collection page opening: eyebrow, the page's single H1, a thin ochre rule and a lead. */
@Component({
  selector: 'app-page-intro',
  template: `
    <header class="intro container">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h1 tabindex="-1">{{ title() }}</h1>
      <span class="rule" aria-hidden="true"></span>
      @if (lead()) {
        <p class="lead">{{ lead() }}</p>
      }
      <ng-content />
    </header>
  `,
  styles: `
    :host {
      display: block;
    }
    .intro {
      padding-block: clamp(2.5rem, 7vw, 5.5rem) clamp(3rem, 7vw, 5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageIntroComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly lead = input<string>();
}
