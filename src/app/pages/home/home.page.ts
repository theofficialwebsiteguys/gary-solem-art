import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Artwork } from '../../content/artwork.types';
import { artworkById } from '../../content/artworks';
import { HOME } from '../../content/page-copy';
import { FINDING_REASONS_STATEMENT, QUOTES } from '../../content/site-text';
import { ArtworkImageComponent } from '../../shared/artwork-image/artwork-image.component';
import { ArtworkTriggerComponent } from '../../shared/artwork-trigger/artwork-trigger.component';
import { HeroCarouselComponent, HeroSlide } from '../../shared/hero-carousel/hero-carousel.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { QuoteComponent } from '../../shared/quote/quote.component';

const isPresent = <T>(value: T | null | undefined): value is T => value != null;

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, HeroCarouselComponent, ArtworkImageComponent, ArtworkTriggerComponent, IconComponent, QuoteComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly copy = HOME;
  protected readonly quotes = QUOTES;
  protected readonly findingReasons = FINDING_REASONS_STATEMENT;

  /** Featured images are looked up by id; anything missing is simply left out. */
  protected readonly heroSlides: HeroSlide[] = HOME.hero.slides
    .map((s) => {
      const artwork = artworkById(s.artworkId);
      return artwork ? { artwork, focal: s.focal, mobileFocal: s.mobileFocal } : null;
    })
    .filter(isPresent);

  protected readonly explore = HOME.explore.items
    .map((item) => {
      const artwork = artworkById(item.image.artworkId);
      return artwork ? { ...item, artwork } : null;
    })
    .filter(isPresent);

  protected readonly markArt = artworkById(HOME.markInTheSand.image.artworkId);
  protected readonly tideArt = artworkById(HOME.tideReturns.image.artworkId);
  protected readonly perspectiveArt = artworkById(HOME.perspective.image.artworkId);

  /** Single-image viewer groups for the featured pieces. */
  protected readonly markGroup: Artwork[] = this.markArt ? [this.markArt] : [];
  protected readonly perspectiveGroup: Artwork[] = this.perspectiveArt ? [this.perspectiveArt] : [];
}
