import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import type { Artwork } from '../../content/artwork.types';
import { ArtworkImageComponent } from '../artwork-image/artwork-image.component';
import { ArtworkViewerService } from '../artwork-viewer/artwork-viewer.service';
import { IconComponent } from '../icon/icon.component';

/**
 * An artwork shown whole at its natural ratio; activating it opens the full-screen viewer.
 * Mouse users get a hover badge; touch screens show a visible "View full size" cue instead,
 * since there is no hover to reveal it.
 */
@Component({
  selector: 'app-artwork-trigger',
  imports: [ArtworkImageComponent, IconComponent],
  template: `
    <button type="button" class="trigger" (click)="open($event)">
      <span class="visually-hidden">View full artwork: </span>
      <span class="trigger__frame">
        <app-artwork-image [artwork]="artwork()" [sizes]="sizes()" [priority]="priority()" />
        <span class="trigger__hint" aria-hidden="true"><app-icon name="fit" [size]="18" /></span>
      </span>
      <span class="trigger__touch" aria-hidden="true"><app-icon name="fit" [size]="15" />View full size</span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
    .trigger {
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      text-align: start;
      cursor: zoom-in;
    }
    .trigger__frame {
      position: relative;
      display: block;
      background: var(--sand);
    }
    .trigger__hint {
      position: absolute;
      right: 0.75rem;
      bottom: 0.75rem;
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      background: rgb(246 243 236 / 0.92);
      color: var(--ink);
      opacity: 0;
      transition: opacity 0.25s var(--ease);
    }
    .trigger:hover .trigger__hint,
    .trigger:focus-visible .trigger__hint {
      opacity: 1;
    }
    .trigger:focus-visible {
      outline-offset: 4px;
    }
    .trigger__touch {
      display: none;
    }
    @media (hover: none) {
      .trigger__hint {
        display: none;
      }
      .trigger__touch {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.4rem;
        min-height: 2.25rem;
        /* Edge-to-edge layouts set --trigger-inset so the cue lines up with the page margin. */
        padding: 0.35rem var(--trigger-inset, 0) 0;
        color: var(--ochre-text);
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.04em;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtworkTriggerComponent {
  readonly artwork = input.required<Artwork>();
  /** The sequence the viewer pages through (usually the whole collection). */
  readonly group = input.required<readonly Artwork[]>();
  readonly sizes = input('100vw');
  readonly priority = input(false);

  private readonly viewer = inject(ArtworkViewerService);

  protected open(event: MouseEvent): void {
    const group = this.group();
    this.viewer.open(group, group.indexOf(this.artwork()), event.currentTarget as HTMLElement);
  }
}
