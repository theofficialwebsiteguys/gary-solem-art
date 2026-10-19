import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { ArtworkTriggerComponent } from '../artwork-trigger/artwork-trigger.component';

type RowKind = 'full' | 'pair' | 'single' | 'tall';
/** Editorial rhythm for runs of wide images. */
type RowWidth = 'contained' | 'narrow-end' | 'bleed' | 'narrow-start';

interface Cell {
  art: Artwork;
  /** flex-grow: equal heights across a row come from growing in proportion to aspect ratio. */
  grow: number;
  sizes: string;
}

interface Row {
  kind: RowKind;
  width: RowWidth;
  cells: Cell[];
  /** For tall rows: the stacked images beside the tall one. */
  side: Cell[];
  sideGrow: number;
}

const TALL_BELOW = 0.6;
const FULL_SIZES = '(min-width: 1312px) 1216px, (min-width: 800px) 92vw, 100vw';

/**
 * Gallery for pieces that mostly stand without text (collages, Finding Reasons).
 * Every image keeps its natural aspect ratio; nothing is cropped. Rows are derived from the
 * images' proportions, so adding an image needs no template changes.
 */
@Component({
  selector: 'app-artwork-gallery',
  imports: [ArtworkTriggerComponent, NgTemplateOutlet],
  templateUrl: './artwork-gallery.component.html',
  styleUrl: './artwork-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtworkGalleryComponent {
  readonly items = input.required<readonly Artwork[]>();
  /** 'collage' keeps rows within the content width; 'editorial' varies widths of wide rows. */
  readonly variant = input<'collage' | 'editorial'>('collage');
  /** Aspect ratio at which an image takes a full row on its own. */
  readonly wideAt = input(2.2);

  protected readonly rows = computed<Row[]>(() => {
    const items = this.items();
    const wideAt = this.wideAt();
    const isMedium = (a: Artwork | undefined): a is Artwork => !!a && a.ratio >= TALL_BELOW && a.ratio < wideAt;
    const rows: Row[] = [];
    let wideCount = 0;

    for (let i = 0; i < items.length; ) {
      const art = items[i];
      if (art.ratio >= wideAt) {
        const width = this.widthFor(wideCount++);
        rows.push({ kind: 'full', width, cells: [cell(art, width === 'bleed' ? '100vw' : FULL_SIZES)], side: [], sideGrow: 0 });
        i += 1;
      } else if (art.ratio < TALL_BELOW) {
        const side: Cell[] = [];
        let j = i + 1;
        while (side.length < 2 && isMedium(items[j])) side.push(cell(items[j++], '(min-width: 800px) 66vw, 100vw'));
        // A stack of images, each full width, has an effective ratio of 1 / Σ(1 / ratio).
        const sideGrow = side.length ? 1 / side.reduce((sum, c) => sum + 1 / c.art.ratio, 0) : 0;
        rows.push({ kind: 'tall', width: 'contained', cells: [cell(art, '(min-width: 800px) 24vw, 60vw')], side, sideGrow });
        i = j;
      } else if (isMedium(items[i + 1])) {
        const sizes = '(min-width: 1312px) 600px, (min-width: 800px) 46vw, 100vw';
        rows.push({ kind: 'pair', width: 'contained', cells: [cell(art, sizes), cell(items[i + 1], sizes)], side: [], sideGrow: 0 });
        i += 2;
      } else {
        rows.push({ kind: 'single', width: 'contained', cells: [cell(art, '(min-width: 1312px) 900px, (min-width: 800px) 72vw, 100vw')], side: [], sideGrow: 0 });
        i += 1;
      }
    }
    return rows;
  });

  private widthFor(index: number): RowWidth {
    if (this.variant() !== 'editorial') return 'contained';
    return (['contained', 'narrow-end', 'bleed', 'narrow-start'] as const)[index % 4];
  }
}

function cell(art: Artwork, sizes: string): Cell {
  return { art, grow: art.ratio, sizes };
}
