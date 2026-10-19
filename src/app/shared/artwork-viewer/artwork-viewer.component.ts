import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { COLLECTIONS } from '../../content/artworks';
import { ARTIST_NAME } from '../../content/site-text';
import { ArtworkImageComponent } from '../artwork-image/artwork-image.component';
import { IconComponent } from '../icon/icon.component';
import { LinesPipe } from '../lines.pipe';
import { ArtworkViewerService } from './artwork-viewer.service';

const SWIPE_DISTANCE = 50;
const PAN_STEP = 120;
const DOUBLE_TAP_MS = 320;

type Zoom = null | 'fill' | number;

/**
 * Full-screen viewer built on a native modal <dialog>: the rest of the page is inert while it
 * is open, Escape closes it, background scrolling is locked and focus returns to the trigger.
 *
 * Fit mode shows the whole artwork. Zoom mode loads the high-resolution detail copy at up to
 * its actual pixel size, panned by scrolling, dragging, touch or the arrow keys.
 */
@Component({
  selector: 'app-artwork-viewer',
  imports: [ArtworkImageComponent, IconComponent, LinesPipe],
  templateUrl: './artwork-viewer.component.html',
  styleUrl: './artwork-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtworkViewerComponent {
  protected readonly viewer = inject(ArtworkViewerService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  protected readonly artist = ARTIST_NAME;
  protected readonly current = this.viewer.current;

  /**
   * null   = fit: the whole artwork on screen.
   * 'fill' = fill the screen in both directions (a wide collage fills the height and pans sideways).
   * number = scale relative to the detail copy's actual pixels (1 = full size).
   */
  protected readonly zoom = signal<Zoom>(null);
  protected readonly detailLoading = signal(false);
  private readonly stageSize = signal({ width: 0, height: 0 });

  protected readonly collectionLabel = computed(() => {
    const art = this.current();
    return art ? COLLECTIONS[art.collection].label : '';
  });

  protected readonly countLabel = computed(() => {
    const total = this.viewer.total();
    return total > 1 ? `${this.viewer.index() + 1} / ${total}` : '';
  });

  /** Spoken form of the count, e.g. "image 3 of 7." */
  protected readonly positionText = computed(() => {
    const total = this.viewer.total();
    return total > 1 ? `image ${this.viewer.index() + 1} of ${total}.` : '';
  });

  protected readonly hasCaption = computed(() => {
    const art = this.current();
    return Boolean(art && (art.title || art.text || art.transcript));
  });

  /** Scale at which the detail copy exactly fits the stage. */
  private readonly fitScale = computed(() => {
    const art = this.current();
    const { width, height } = this.stageSize();
    if (!art || !width || !height) return 1;
    return Math.min(width / art.detail.width, height / art.detail.height, 1);
  });

  /** Scale at which the detail copy covers the whole stage (one direction then pans). */
  private readonly fillScale = computed(() => {
    const art = this.current();
    const { width, height } = this.stageSize();
    if (!art || !width || !height) return 1;
    return Math.min(1, Math.max(width / art.detail.width, height / art.detail.height));
  });

  /** Zoom is offered when the detail copy is meaningfully larger than the fitted view. */
  protected readonly canZoom = computed(() => this.fitScale() < 0.8);

  private readonly scale = computed(() => {
    const zoom = this.zoom();
    return zoom === 'fill' ? this.fillScale() : zoom;
  });

  /**
   * Zoom steps above "fit". For very wide or tall pieces the first step fills the screen,
   * which is the most useful view on a phone; then each step doubles, up to full size.
   */
  private readonly steps = computed<Exclude<Zoom, null>[]>(() => {
    const fit = this.fitScale();
    const fill = this.fillScale();
    const steps: Exclude<Zoom, null>[] = [];
    let next = fit * 2;
    if (fill > fit * 1.3 && fill < 0.98) {
      steps.push('fill');
      next = fill * 2;
    }
    for (; next < 0.98; next *= 2) steps.push(next);
    steps.push(1);
    return steps;
  });

  protected readonly atFullSize = computed(() => (this.scale() ?? 0) >= 0.999);

  protected readonly zoomedSize = computed(() => {
    const art = this.current();
    const scale = this.scale();
    if (!art || scale === null) return null;
    return { width: Math.round(art.detail.width * scale), height: Math.round(art.detail.height * scale) };
  });

  private resizeObserver: ResizeObserver | null = null;
  private pointer: { id: number; x: number; y: number; left: number; top: number; type: string } | null = null;
  /** Point of the artwork (as fractions) kept centred while zooming; dropped once the visitor pans. */
  private focusPoint: { fx: number; fy: number } | null = null;
  private lastTap: { time: number; x: number; y: number } | null = null;
  private lastDoubleTap = 0;

  constructor() {
    effect(() => {
      const open = this.viewer.isOpen();
      const dialog = this.dialog().nativeElement;
      if (open && !dialog.open) {
        // Wait until the artwork and controls are rendered, so focus has somewhere to land.
        afterNextRender(
          () => {
            if (!this.viewer.isOpen() || dialog.open) return;
            this.lockScroll();
            dialog.showModal();
            this.closeButton()?.nativeElement.focus();
            this.observeStage();
          },
          { injector: this.injector },
        );
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });

    // Each artwork opens fitted to the screen; neighbours are warmed up for quick paging.
    effect(() => {
      const art = this.current();
      untracked(() => {
        this.zoom.set(null);
        this.focusPoint = null;
        this.detailLoading.set(false);
        if (art) this.preloadNeighbours();
      });
    });

    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.viewer.close());

    inject(DestroyRef).onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.unlockScroll();
    });
  }

  // ─── Open / close ────────────────────────────────────────────────────────

  protected close(): void {
    this.viewer.close();
  }

  /** Fires for every close path: button, Escape, navigation. */
  protected onDialogClose(): void {
    this.viewer.close();
    this.resizeObserver?.disconnect();
    this.unlockScroll();
    const trigger = this.viewer.takeReturnFocus();
    if (trigger?.isConnected) trigger.focus();
  }

  /** Clicking the backdrop area (outside the image and controls) closes the viewer. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  private lockScroll(): void {
    const root = this.document.documentElement;
    const scrollbar = (this.document.defaultView?.innerWidth ?? 0) - root.clientWidth;
    root.style.setProperty('--scrollbar-width', `${Math.max(scrollbar, 0)}px`);
    root.classList.add('scroll-locked');
  }

  private unlockScroll(): void {
    const root = this.document.documentElement;
    root.classList.remove('scroll-locked');
    root.style.removeProperty('--scrollbar-width');
  }

  private observeStage(): void {
    const view = this.document.defaultView;
    if (!view || !('ResizeObserver' in view)) return;
    this.resizeObserver?.disconnect();
    afterNextRender(
      () => {
        const el = this.stage()?.nativeElement;
        if (!el) return;
        this.resizeObserver = new ResizeObserver(([entry]) => {
          const box = entry.contentRect;
          this.stageSize.set({ width: box.width, height: box.height });
          // The stage grows when the caption hides on zoom, or on rotation: keep the same spot centred.
          if (this.zoom() !== null) this.afterRender(() => this.applyFocus());
        });
        this.resizeObserver.observe(el);
      },
      { injector: this.injector },
    );
  }

  // ─── Paging ──────────────────────────────────────────────────────────────

  protected next(): void {
    this.viewer.next();
  }

  protected previous(): void {
    this.viewer.previous();
  }

  private preloadNeighbours(): void {
    const items = this.viewer.items();
    if (items.length < 2) return;
    const i = this.viewer.index();
    for (const art of [items[(i + 1) % items.length], items[(i - 1 + items.length) % items.length]]) {
      const img = new Image();
      img.sizes = '100vw';
      img.srcset = art.variants.map((v) => `${v.src} ${v.width}w`).join(', ');
    }
  }

  // ─── Zoom ────────────────────────────────────────────────────────────────

  protected zoomIn(): void {
    const current = this.scale() ?? this.fitScale();
    const next = this.steps().find((step) => this.scaleOf(step) > current * 1.01);
    if (next !== undefined) this.setZoom(next);
  }

  protected zoomOut(): void {
    const current = this.scale();
    if (current === null) return;
    const previous = [...this.steps()].reverse().find((step) => this.scaleOf(step) < current * 0.99);
    this.setZoom(previous ?? null);
  }

  protected toggleActualSize(): void {
    this.setZoom(this.zoom() === null ? 1 : null);
  }

  protected onDoubleClick(event: MouseEvent): void {
    // Touch double-taps are handled in onPointerUp; ignore the synthetic dblclick that may follow.
    if (performance.now() - this.lastDoubleTap < 600) return;
    this.toggleZoomAt(event.clientX, event.clientY);
  }

  protected onDetailLoaded(): void {
    this.detailLoading.set(false);
  }

  private scaleOf(step: Exclude<Zoom, null>): number {
    return step === 'fill' ? this.fillScale() : step;
  }

  /** Double-click / double-tap: zoom into that spot, or back out to the whole artwork. */
  private toggleZoomAt(clientX: number, clientY: number): void {
    if (!this.canZoom()) return;
    if (this.zoom() !== null) {
      this.setZoom(null);
      return;
    }
    this.setZoom(this.steps()[0], this.fractionAt(clientX, clientY));
  }

  /** Where a screen point falls on the fitted (letterboxed) artwork, as fractions of its size. */
  private fractionAt(clientX: number, clientY: number): { fx: number; fy: number } | undefined {
    const stage = this.stage()?.nativeElement;
    const art = this.current();
    if (!stage || !art) return undefined;
    const rect = stage.getBoundingClientRect();
    const w = art.detail.width * this.fitScale();
    const h = art.detail.height * this.fitScale();
    const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
    return {
      fx: clamp((clientX - rect.left - (rect.width - w) / 2) / w),
      fy: clamp((clientY - rect.top - (rect.height - h) / 2) / h),
    };
  }

  /** Changes zoom while keeping the same point of the artwork centred (or the tapped point). */
  private setZoom(zoom: Zoom, at?: { fx: number; fy: number }): void {
    if (!this.canZoom() && zoom !== null) return;
    const stage = this.stage()?.nativeElement;
    const before = this.zoomedSize();
    let focus = at ?? { fx: 0.5, fy: 0.5 };
    if (!at && stage && before) {
      focus = {
        fx: (stage.scrollLeft + stage.clientWidth / 2) / before.width,
        fy: (stage.scrollTop + stage.clientHeight / 2) / before.height,
      };
    }
    if (zoom !== null && this.zoom() === null) this.detailLoading.set(true);
    this.focusPoint = zoom === null ? null : focus;
    this.zoom.set(zoom);
    this.afterRender(() => this.applyFocus());
  }

  private applyFocus(): void {
    const el = this.stage()?.nativeElement;
    const size = this.zoomedSize();
    const focus = this.focusPoint;
    if (!el || !size || !focus) return;
    el.scrollLeft = focus.fx * size.width - el.clientWidth / 2;
    el.scrollTop = focus.fy * size.height - el.clientHeight / 2;
  }

  private afterRender(fn: () => void): void {
    afterNextRender(fn, { injector: this.injector });
  }

  // ─── Keyboard, swipe and drag ────────────────────────────────────────────

  protected onKeydown(event: KeyboardEvent): void {
    const zoomed = this.zoom() !== null;
    const stage = this.stage()?.nativeElement;
    if (zoomed && event.key.startsWith('Arrow')) this.focusPoint = null;
    switch (event.key) {
      case 'ArrowRight':
        if (zoomed) stage?.scrollBy({ left: PAN_STEP });
        else this.next();
        break;
      case 'ArrowLeft':
        if (zoomed) stage?.scrollBy({ left: -PAN_STEP });
        else this.previous();
        break;
      case 'ArrowDown':
        if (!zoomed) return;
        stage?.scrollBy({ top: PAN_STEP });
        break;
      case 'ArrowUp':
        if (!zoomed) return;
        stage?.scrollBy({ top: -PAN_STEP });
        break;
      case '+':
      case '=':
        this.zoomIn();
        break;
      case '-':
        this.zoomOut();
        break;
      case '0':
        this.setZoom(null);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  protected onPointerDown(event: PointerEvent): void {
    const stage = this.stage()?.nativeElement;
    if (!stage || event.button !== 0) return;
    this.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: stage.scrollLeft,
      top: stage.scrollTop,
      type: event.pointerType,
    };
    this.focusPoint = null;
    // Mouse drag pans a zoomed image; touch uses native scrolling.
    if (this.zoom() !== null && event.pointerType === 'mouse') {
      stage.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
  }

  protected onPointerMove(event: PointerEvent): void {
    const stage = this.stage()?.nativeElement;
    const p = this.pointer;
    if (!stage || !p || p.id !== event.pointerId || this.zoom() === null || p.type !== 'mouse') return;
    stage.scrollLeft = p.left - (event.clientX - p.x);
    stage.scrollTop = p.top - (event.clientY - p.y);
  }

  protected onPointerUp(event: PointerEvent): void {
    const p = this.pointer;
    this.pointer = null;
    if (!p || p.id !== event.pointerId || p.type === 'mouse') return;
    const dx = event.clientX - p.x;
    const dy = event.clientY - p.y;

    // A tap: two in quick succession toggle zoom at that spot.
    if (event.type === 'pointerup' && Math.hypot(dx, dy) < 10) {
      const now = performance.now();
      const last = this.lastTap;
      if (last && now - last.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 40) {
        this.lastTap = null;
        this.lastDoubleTap = now;
        this.toggleZoomAt(event.clientX, event.clientY);
      } else {
        this.lastTap = { time: now, x: event.clientX, y: event.clientY };
      }
      return;
    }

    // A horizontal swipe pages through the collection (only when not zoomed, where swipes pan).
    if (this.zoom() === null && Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) this.next();
      else this.previous();
    }
  }
}
