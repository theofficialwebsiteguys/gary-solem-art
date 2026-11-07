import { ChangeDetectionStrategy, Component } from '@angular/core';
import { artworkById, artworksIn } from '../../content/artworks';
import { DIRECT_PHOTOGRAPHY } from '../../content/page-copy';
import { FINDING_REASONS_STATEMENT, QUOTES } from '../../content/site-text';
import { ArtworkGalleryComponent } from '../../shared/artwork-gallery/artwork-gallery.component';
import { ArtworkTriggerComponent } from '../../shared/artwork-trigger/artwork-trigger.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';
import { QuoteComponent } from '../../shared/quote/quote.component';

@Component({
  selector: 'app-direct-photography-page',
  imports: [ArtworkGalleryComponent, ArtworkTriggerComponent, CollectionLinksComponent, QuoteComponent],
  template: `
    <section class="opening perspective" aria-labelledby="perspective-heading">
      <div class="container">
        <h1 id="perspective-heading" class="eyebrow perspective__heading" tabindex="-1">{{ copy.opening.heading }}</h1>
        <app-quote [text]="quotes.feelHuman" align="center" size="large" />

        @if (openingArt) {
          <div class="perspective__media">
            <app-artwork-trigger
              [artwork]="openingArt"
              [group]="allPhotographs"
              sizes="(min-width: 1312px) 1216px, (min-width: 720px) 92vw, 100vw"
            />
          </div>
        }

        <div class="perspective__words">
          <figure class="statement">
            <blockquote>
              <p>{{ statement.text }}</p>
            </blockquote>
            <figcaption>— Gary Solem, <cite>Finding Reasons</cite></figcaption>
          </figure>

          @if (copy.opening.story; as story) {
            <div class="prose perspective__story">
              @for (paragraph of story; track $index) {
                <p>{{ paragraph }}</p>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <section class="collection" id="finding-reasons" aria-labelledby="photos-heading">
      <div class="container">
        <h2 id="photos-heading" class="visually-hidden">Photographs</h2>
        <app-artwork-gallery [items]="photographs" variant="editorial" />
      </div>
    </section>

    <app-collection-links current="/direct-photography" />
  `,
  styleUrl: '../collection-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectPhotographyPage {
  protected readonly copy = DIRECT_PHOTOGRAPHY;
  protected readonly quotes = QUOTES;
  protected readonly statement = FINDING_REASONS_STATEMENT;

  /** The opening photograph opens the viewer on the whole set but isn't repeated in the gallery. */
  protected readonly openingArt = artworkById(DIRECT_PHOTOGRAPHY.opening.image.artworkId);
  protected readonly allPhotographs = artworksIn('finding-reasons');
  protected readonly photographs = this.allPhotographs.filter((a) => a !== this.openingArt);
}
