import { Injectable, computed, signal } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';

/** State for the single full-screen artwork viewer rendered by the app shell. */
@Injectable({ providedIn: 'root' })
export class ArtworkViewerService {
  private readonly _items = signal<readonly Artwork[]>([]);
  private readonly _index = signal(0);
  private readonly _isOpen = signal(false);
  private returnFocusTo: HTMLElement | null = null;

  readonly items = this._items.asReadonly();
  readonly index = this._index.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly current = computed<Artwork | null>(() => this._items()[this._index()] ?? null);
  readonly total = computed(() => this._items().length);

  /** Opens the viewer on `items[index]`. Focus returns to `trigger` when it closes. */
  open(items: readonly Artwork[], index: number, trigger?: HTMLElement | null): void {
    if (!items.length) return;
    this.returnFocusTo = trigger ?? null;
    this._items.set(items);
    this._index.set(Math.min(Math.max(index, 0), items.length - 1));
    this._isOpen.set(true);
  }

  next(): void {
    const n = this.total();
    if (n > 1) this._index.update((i) => (i + 1) % n);
  }

  previous(): void {
    const n = this.total();
    if (n > 1) this._index.update((i) => (i - 1 + n) % n);
  }

  close(): void {
    this._isOpen.set(false);
  }

  /** Hands the stored trigger to the viewer once, so focus can be restored. */
  takeReturnFocus(): HTMLElement | null {
    const el = this.returnFocusTo;
    this.returnFocusTo = null;
    return el;
  }
}
