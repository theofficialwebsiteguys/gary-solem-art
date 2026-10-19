import { ChangeDetectionStrategy, Component } from '@angular/core';
import { artworksIn } from '../../content/artworks';
import { DIRECT_PHOTOGRAPHY } from '../../content/page-copy';
import { FINDING_REASONS_STATEMENT } from '../../content/site-text';
import { ArtworkGalleryComponent } from '../../shared/artwork-gallery/artwork-gallery.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';
import { PageIntroComponent } from '../../shared/page-intro/page-intro.component';

@Component({
  selector: 'app-direct-photography-page',
  imports: [PageIntroComponent, ArtworkGalleryComponent, CollectionLinksComponent],
  template: `
    <app-page-intro [title]="copy.title" [eyebrow]="copy.eyebrow">
      <figure class="statement lead-statement">
        <blockquote>
          <p>{{ statement.text }}</p>
        </blockquote>
        <figcaption>— Gary Solem</figcaption>
      </figure>
    </app-page-intro>

    <section class="collection" id="finding-reasons" aria-labelledby="photos-heading">
      <div class="container">
        <header class="collection__head">
          <h2 id="photos-heading" class="visually-hidden">Photographs</h2>
          <p class="prose">{{ copy.lead }}</p>
        </header>
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
  protected readonly statement = FINDING_REASONS_STATEMENT;
  protected readonly photographs = artworksIn('finding-reasons');
}
