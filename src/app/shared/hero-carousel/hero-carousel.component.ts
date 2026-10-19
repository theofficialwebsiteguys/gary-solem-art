import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { ArtworkImageComponent } from '../artwork-image/artwork-image.component';
import { IconComponent } from '../icon/icon.component';

export interface HeroSlide {
  artwork: Artwork;
  /** object-position on wide screens, where the image fills the hero. */
  focal: string;
  /** object-position on phones, where the image sits below the heading at 4:3. */
  mobileFocal: string;
}

const SWIPE_DISTANCE = 50;

/**
 * Large photographic opening. Manual navigation only (no autoplay); swipe on touch screens.
 * Only the current slide and its neighbour are loaded, so the collection is never preloaded.
 * Projected content (the page heading) sits over the light upper area on wide screens and
 * above the photograph on phones.
 */
@Component({
  selector: 'app-hero-carousel',
  imports: [ArtworkImageComponent, IconComponent],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCarouselComponent {
  readonly slides = input.required<readonly HeroSlide[]>();
  readonly label = input('Featured work');

  protected readonly index = signal(0);
  protected readonly announcement = signal('');
  private readonly rendered = signal<ReadonlySet<number>>(new Set([0]));
  private touchStart: { x: number; y: number } | null = null;

  protected readonly total = computed(() => this.slides().length);

  protected isRendered(i: number): boolean {
    return this.rendered().has(i);
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  protected next(): void {
    this.go(this.index() + 1);
  }

  protected previous(): void {
    this.go(this.index() - 1);
  }

  /** After the first image has loaded, quietly prepare the next slide. */
  protected onFirstLoaded(): void {
    if (this.total() > 1) setTimeout(() => this.render(1), 1500);
  }

  protected onPointerDown(event: PointerEvent): void {
    this.touchStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(event: PointerEvent): void {
    const start = this.touchStart;
    this.touchStart = null;
    if (!start || this.total() < 2) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) this.next();
      else this.previous();
    }
  }

  private go(target: number): void {
    const n = this.total();
    if (n < 2) return;
    const i = (target + n) % n;
    this.render(i);
    this.render((i + 1) % n);
    this.index.set(i);
    this.announcement.set(`Slide ${i + 1} of ${n}`);
  }

  private render(i: number): void {
    if (!this.rendered().has(i)) this.rendered.update((set) => new Set([...set, i]));
  }
}
