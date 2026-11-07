import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COLLECTIONS, artworkById, artworksIn } from '../../content/artworks';
import { MY_ART } from '../../content/page-copy';
import { COLLAGE_STATEMENT } from '../../content/site-text';
import { ArtworkGalleryComponent } from '../../shared/artwork-gallery/artwork-gallery.component';
import { ArtworkStoryComponent } from '../../shared/artwork-story/artwork-story.component';
import { ArtworkTriggerComponent } from '../../shared/artwork-trigger/artwork-trigger.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';
import { ScrollToDirective } from '../../shared/scroll-to.directive';

@Component({
  selector: 'app-my-art-page',
  imports: [ArtworkStoryComponent, ArtworkGalleryComponent, ArtworkTriggerComponent, CollectionLinksComponent, ScrollToDirective],
  template: `
    <section class="opening mark" aria-labelledby="mark-heading">
      <div class="container mark__grid">
        <header>
          <p class="eyebrow">{{ copy.title }}</p>
          <h1 id="mark-heading" tabindex="-1">{{ copy.opening.heading }}</h1>
          <span class="rule" aria-hidden="true"></span>
          <nav class="subnav" aria-label="Sections on this page">
            <a class="subnav__link" [appScrollTo]="mandalaInfo.anchor">{{ copy.mandalas.heading }}</a>
            <a class="subnav__link" [appScrollTo]="collageInfo.anchor">{{ copy.collages.heading }}</a>
          </nav>
        </header>

        @if (openingArt) {
          <div class="mark__media">
            <app-artwork-trigger
              [artwork]="openingArt"
              [group]="allCollages"
              [priority]="true"
              sizes="(min-width: 1312px) 700px, (min-width: 900px) 56vw, 100vw"
            />
          </div>
        }
      </div>
    </section>

    <section class="collection" [id]="mandalaInfo.anchor" aria-labelledby="mandalas-heading" tabindex="-1">
      <div class="container">
        <header class="collection__head">
          <p class="eyebrow">{{ copy.mandalas.eyebrow }}</p>
          <h2 id="mandalas-heading">{{ copy.mandalas.heading }}</h2>
          <span class="rule" aria-hidden="true"></span>
          <p class="prose">{{ copy.mandalas.intro }}</p>
        </header>
        <app-artwork-story [items]="mandalas" />
      </div>
    </section>

    <section class="collection collection--collage" [id]="collageInfo.anchor" aria-labelledby="collage-heading" tabindex="-1">
      <div class="container">
        <header class="collection__head">
          <h2 id="collage-heading">{{ copy.collages.heading }}</h2>
          <span class="rule" aria-hidden="true"></span>
          <figure class="statement">
            <blockquote>
              <p>{{ collageStatement.text }}</p>
            </blockquote>
            <figcaption>— Gary Solem</figcaption>
          </figure>
        </header>
        <app-artwork-gallery [items]="collages" />
      </div>
    </section>

    <app-collection-links current="/my-art" />
  `,
  styleUrl: '../collection-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyArtPage {
  protected readonly copy = MY_ART;
  protected readonly collageStatement = COLLAGE_STATEMENT;
  protected readonly mandalaInfo = COLLECTIONS['intro-images'];
  protected readonly collageInfo = COLLECTIONS['collage-pieces'];
  protected readonly mandalas = artworksIn('intro-images');

  /** The opening piece is a collage; it opens the viewer on the whole set but isn't repeated in the gallery. */
  protected readonly openingArt = artworkById(MY_ART.opening.image.artworkId);
  protected readonly allCollages = artworksIn('collage-pieces');
  protected readonly collages = this.allCollages.filter((a) => a !== this.openingArt);
}
