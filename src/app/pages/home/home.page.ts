import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { artworkById } from '../../content/artworks';
import { HOME } from '../../content/page-copy';
import { ArtworkImageComponent } from '../../shared/artwork-image/artwork-image.component';
import { HeroCarouselComponent, HeroSlide } from '../../shared/hero-carousel/hero-carousel.component';
import { IconComponent } from '../../shared/icon/icon.component';

const isPresent = <T>(value: T | null | undefined): value is T => value != null;

/** Largest an Explore image is shown, in px; mirrors --frame-width and --frame-height in the stylesheet. */
const FRAME_WIDTH = 960;
const FRAME_HEIGHT = 608;

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, HeroCarouselComponent, ArtworkImageComponent, IconComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly copy = HOME;

  /** Featured images are looked up by id; anything missing is simply left out. */
  protected readonly heroSlides: HeroSlide[] = HOME.hero.slides
    .map((s) => {
      const artwork = artworkById(s.artworkId);
      return artwork ? { artwork, focal: s.focal, mobileFocal: s.mobileFocal } : null;
    })
    .filter(isPresent);

  /** Whole pieces keep their own shape; cover crops use the configured frame. */
  protected readonly explore = HOME.explore.items
    .map((item) => {
      const artwork = artworkById(item.image.artworkId);
      if (!artwork) return null;
      const frameRatio = item.image.ratio ?? artwork.ratio;
      const width = Math.round(Math.min(FRAME_WIDTH, FRAME_HEIGHT * frameRatio));
      return { ...item, artwork, frameRatio, sizes: `(min-width: 1060px) ${width}px, 92vw` };
    })
    .filter(isPresent);
}
