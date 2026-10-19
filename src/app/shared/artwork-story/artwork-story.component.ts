import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { ArtworkTriggerComponent } from '../artwork-trigger/artwork-trigger.component';
import { LinesPipe } from '../lines.pipe';

type StoryLayout = 'wide' | 'split' | 'portrait';

interface StoryEntry {
  art: Artwork;
  layout: StoryLayout;
  reversed: boolean;
  sizes: string;
}

const SIZES: Record<StoryLayout, string> = {
  wide: '(min-width: 1312px) 1216px, (min-width: 800px) 92vw, 100vw',
  split: '(min-width: 1312px) 700px, (min-width: 800px) 56vw, 100vw',
  portrait: '(min-width: 1312px) 500px, (min-width: 800px) 40vw, 100vw',
};

/**
 * Image-led sequence pairing each artwork with Gary's own text (statement or poem).
 * Wide pieces take the full row with text beneath; others sit beside their text, alternating sides.
 * Layout follows each image's aspect ratio, so new images need no template changes.
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
  /** Aspect ratio (width / height) at which an image takes a full row. */
  readonly wideAt = input(2);
  /** Show the client's text number ("01") above each passage. */
  readonly showNumbers = input(true);

  protected readonly entries = computed<StoryEntry[]>(() => {
    let sideBySide = 0;
    return this.items().map((art) => {
      const layout: StoryLayout = art.ratio >= this.wideAt() ? 'wide' : art.ratio < 0.9 ? 'portrait' : 'split';
      const reversed = layout !== 'wide' && sideBySide++ % 2 === 1;
      return { art, layout, reversed, sizes: SIZES[layout] };
    });
  });

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
