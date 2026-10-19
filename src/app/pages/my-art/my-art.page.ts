import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COLLECTIONS, artworksIn } from '../../content/artworks';
import { MY_ART } from '../../content/page-copy';
import { COLLAGE_STATEMENT, QUOTES } from '../../content/site-text';
import { ArtworkGalleryComponent } from '../../shared/artwork-gallery/artwork-gallery.component';
import { ArtworkStoryComponent } from '../../shared/artwork-story/artwork-story.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';
import { PageIntroComponent } from '../../shared/page-intro/page-intro.component';
import { QuoteComponent } from '../../shared/quote/quote.component';
import { ScrollToDirective } from '../../shared/scroll-to.directive';

@Component({
  selector: 'app-my-art-page',
  imports: [PageIntroComponent, QuoteComponent, ArtworkStoryComponent, ArtworkGalleryComponent, CollectionLinksComponent, ScrollToDirective],
  template: `
    <app-page-intro [title]="copy.title" [lead]="copy.lead">
      <app-quote class="intro-quote" [text]="quotes.smoothState" />
      <nav class="subnav" aria-label="Sections on this page">
        <a class="subnav__link" [appScrollTo]="mandalaInfo.anchor">{{ copy.mandalas.heading }}</a>
        <a class="subnav__link" [appScrollTo]="collageInfo.anchor">{{ copy.collages.heading }}</a>
      </nav>
    </app-page-intro>

    <section class="collection" [id]="mandalaInfo.anchor" aria-labelledby="mandalas-heading" tabindex="-1">
      <div class="container">
        <header class="collection__head">
          <p class="eyebrow">{{ copy.mandalas.eyebrow }}</p>
          <h2 id="mandalas-heading">{{ copy.mandalas.heading }}</h2>
          <span class="rule" aria-hidden="true"></span>
          <p class="prose">{{ copy.mandalas.intro }}</p>
        </header>
        <app-artwork-story [items]="mandalas" [wideAt]="2" />
      </div>
    </section>

    <section class="collection collection--collage" [id]="collageInfo.anchor" aria-labelledby="collage-heading" tabindex="-1">
      <div class="container">
        <header class="collection__head">
          <p class="eyebrow">{{ copy.collages.eyebrow }}</p>
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
  protected readonly quotes = QUOTES;
  protected readonly collageStatement = COLLAGE_STATEMENT;
  protected readonly mandalaInfo = COLLECTIONS['intro-images'];
  protected readonly collageInfo = COLLECTIONS['collage-pieces'];
  protected readonly mandalas = artworksIn('intro-images');
  protected readonly collages = artworksIn('collage-pieces');
}
