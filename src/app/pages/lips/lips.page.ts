import { ChangeDetectionStrategy, Component } from '@angular/core';
import { artworkById, artworksIn } from '../../content/artworks';
import { LIPS } from '../../content/page-copy';
import { LIP_DEFINITION } from '../../content/site-text';
import { ArtworkImageComponent } from '../../shared/artwork-image/artwork-image.component';
import { ArtworkStoryComponent } from '../../shared/artwork-story/artwork-story.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';

@Component({
  selector: 'app-lips-page',
  imports: [ArtworkImageComponent, ArtworkStoryComponent, CollectionLinksComponent],
  template: `
    <section class="opening tide" aria-labelledby="tide-heading">
      <div class="tide__inner">
        <div class="tide__text container">
          <header class="tide__copy">
            <p class="eyebrow">{{ copy.title }}</p>
            <h1 id="tide-heading" tabindex="-1">{{ copy.opening.heading }}</h1>
            <span class="rule" aria-hidden="true"></span>
            <figure class="definition">
              <blockquote>
                <p>{{ definition.text }}</p>
              </blockquote>
              <figcaption>— Gary Solem</figcaption>
            </figure>
          </header>
        </div>
        @if (openingArt) {
          <div class="tide__media">
            <app-artwork-image
              [artwork]="openingArt"
              fit="cover"
              [focal]="copy.opening.image.focal"
              [priority]="true"
              sizes="100vw"
            />
          </div>
        }
      </div>
    </section>

    <section class="collection" id="lips" aria-labelledby="poems-heading">
      <div class="container">
        <h2 id="poems-heading" class="visually-hidden">Photographs and poems</h2>
        <app-artwork-story [items]="waves" />
      </div>
    </section>

    <app-collection-links current="/lips" />
  `,
  styleUrl: '../collection-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LipsPage {
  protected readonly copy = LIPS;
  protected readonly definition = LIP_DEFINITION;
  protected readonly openingArt = artworkById(LIPS.opening.image.artworkId);
  protected readonly waves = artworksIn('lips');
}
