import { ChangeDetectionStrategy, Component, computed, input, isDevMode, output } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { canCrop } from '../../content/artworks';

export type ImageFit = 'natural' | 'cover' | 'contain';

/**
 * Responsive <img> for an artwork, using the generated WebP display copies.
 *
 * - natural: full width, natural aspect ratio (intrinsic width/height prevent layout shift).
 * - contain: fills a sized parent, whole piece always visible.
 * - cover:   fills a sized parent with a deliberate crop. Only honoured for single photographs;
 *            composites (collages, diptychs, captioned pieces) silently fall back to contain.
 */
@Component({
  selector: 'app-artwork-image',
  template: `
    <img
      [attr.loading]="priority() ? 'eager' : 'lazy'"
      [attr.fetchpriority]="priority() ? 'high' : null"
      decoding="async"
      [attr.sizes]="sizes()"
      [attr.srcset]="srcset()"
      [src]="fallback().src"
      [attr.width]="fallback().width"
      [attr.height]="fallback().height"
      [alt]="altText()"
      [class]="'fit-' + effectiveFit()"
      [style.object-position]="effectiveFit() === 'cover' ? (focal() ?? artwork().focal ?? '50% 50%') : null"
      (load)="loaded.emit()"
    />
  `,
  styles: `
    :host {
      display: block;
    }
    :host(.fill) {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: auto;
    }
    .fit-cover,
    .fit-contain {
      height: 100%;
    }
    .fit-cover {
      object-fit: cover;
    }
    .fit-contain {
      object-fit: contain;
    }
  `,
  host: { '[class.fill]': "effectiveFit() !== 'natural'" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtworkImageComponent {
  readonly artwork = input.required<Artwork>();
  /** The `sizes` attribute: how wide the image is displayed at each breakpoint. */
  readonly sizes = input('100vw');
  readonly fit = input<ImageFit>('natural');
  /** Overrides the artwork's default focal point for cover crops. */
  readonly focal = input<string | undefined>(undefined);
  /** Above-the-fold images: load eagerly with high priority. */
  readonly priority = input(false);
  /** Override the alt text, e.g. '' when an adjacent link already names the image. */
  readonly alt = input<string | undefined>(undefined);
  readonly loaded = output<void>();

  protected readonly effectiveFit = computed<ImageFit>(() => {
    const fit = this.fit();
    if (fit === 'cover' && !canCrop(this.artwork())) {
      if (isDevMode()) console.warn(`[artwork-image] ${this.artwork().id} is a composite and is never cropped.`);
      return 'contain';
    }
    return fit;
  });

  protected readonly srcset = computed(() =>
    this.artwork()
      .variants.map((v) => `${v.src} ${v.width}w`)
      .join(', '),
  );

  /** Mid-sized copy for browsers that ignore srcset; also supplies the intrinsic dimensions. */
  protected readonly fallback = computed(() => {
    const variants = this.artwork().variants;
    return variants.find((v) => v.width >= 1200) ?? variants[variants.length - 1] ?? this.artwork().detail;
  });

  protected readonly altText = computed(() => this.alt() ?? this.artwork().alt);
}
