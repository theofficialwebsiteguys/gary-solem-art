import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { ArtworkTriggerComponent } from '../artwork-trigger/artwork-trigger.component';
import { LinesPipe } from '../lines.pipe';

interface StoryEntry {
  art: Artwork;
  /** The text's number, or the filename's while the text is pending, so the sequence has no gaps. */
  number: number | null;
  sizes: string;
}

/** Tallest an image is shown on wider screens, in px; mirrors --story-height in the stylesheet. */
const STORY_HEIGHT = 760;
const CONTAINER = 1216;

/**
 * Image-led sequence pairing each artwork with Gary's own text (statement or poem):
 * the number above, the artwork, then the text beneath. Each piece is as wide as the column
 * allows while still fitting the screen's height, so new images need no template changes.
 */
@Component({
  selector: 'app-artwork-story',
  imports: [ArtworkTriggerComponent, LinesPipe],
  templateUrl: './artwork-story.component.html',
  styleUrl: './artwork-story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtworkStoryComponent {
  readonly items = input.required<readonly Artwork[]>();
  /** Show the client's text number ("01") above each piece. */
  readonly showNumbers = input(true);

  protected readonly entries = computed<StoryEntry[]>(() =>
    this.items().map((art) => {
      const width = Math.min(CONTAINER, Math.round(STORY_HEIGHT * art.ratio));
      return {
        art,
        number: art.text?.number ?? art.sequence,
        sizes: `(min-width: 1312px) ${width}px, (min-width: 800px) 92vw, 100vw`,
      };
    }),
  );

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
