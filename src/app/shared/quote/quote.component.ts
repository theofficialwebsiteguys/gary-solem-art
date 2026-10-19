import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ARTIST_NAME } from '../../content/site-text';

/** A short verbatim quotation from Gary in the handwritten accent face, with attribution. */
@Component({
  selector: 'app-quote',
  template: `
    <figure class="quote" [class.quote--center]="align() === 'center'" [class.quote--large]="size() === 'large'">
      <blockquote class="quote__text">
        <p>{{ text() }}</p>
      </blockquote>
      <figcaption class="quote__by">— {{ attribution() }}</figcaption>
    </figure>
  `,
  styles: `
    .quote {
      margin: 0;
    }
    .quote__text {
      margin: 0;
      color: var(--ink);
      font-family: var(--font-hand);
      font-size: clamp(1.75rem, 2.8vw, 2.25rem);
      font-weight: 500;
      line-height: 1.25;
    }
    .quote__text p {
      margin: 0;
    }
    .quote--large .quote__text {
      font-size: clamp(2.25rem, 5vw, 3.75rem);
      line-height: 1.15;
    }
    .quote__by {
      margin-top: 0.85rem;
      color: var(--ochre-text);
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
    }
    .quote--center {
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteComponent {
  /** Must be Gary's exact words (see QUOTES in site-text.ts). */
  readonly text = input.required<string>();
  readonly attribution = input(ARTIST_NAME);
  readonly align = input<'start' | 'center'>('start');
  readonly size = input<'default' | 'large'>('default');
}
