import { ChangeDetectionStrategy, Component } from '@angular/core';
import { artworksIn } from '../../content/artworks';
import { WAVE_PHOTOGRAPHY } from '../../content/page-copy';
import { LIP_DEFINITION } from '../../content/site-text';
import { ArtworkStoryComponent } from '../../shared/artwork-story/artwork-story.component';
import { CollectionLinksComponent } from '../../shared/collection-links/collection-links.component';
import { PageIntroComponent } from '../../shared/page-intro/page-intro.component';

@Component({
  selector: 'app-wave-photography-page',
  imports: [PageIntroComponent, ArtworkStoryComponent, CollectionLinksComponent],
  template: `
    <app-page-intro [title]="copy.title" [eyebrow]="copy.eyebrow">
      <figure class="definition">
        <blockquote>
          <p>{{ definition.text }}</p>
        </blockquote>
        <figcaption class="attribution">— Gary Solem</figcaption>
      </figure>
      <p class="lead intro-after">{{ copy.lead }}</p>
    </app-page-intro>

    <section class="collection" id="lips" aria-labelledby="poems-heading">
      <div class="container">
        <h2 id="poems-heading" class="visually-hidden">Photographs and poems</h2>
        <app-artwork-story [items]="waves" [wideAt]="1.9" />
      </div>
    </section>

    <app-collection-links current="/wave-photography" />
  `,
  styleUrl: '../collection-page.scss',
  styles: `
    .definition blockquote {
      color: var(--ink);
      font-family: var(--font-serif);
      font-size: clamp(1.4rem, 2.2vw, 1.75rem);
      font-style: italic;
      line-height: 1.45;
    }
    .definition p {
      margin: 0;
    }
    .intro-after {
      margin-top: 2.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WavePhotographyPage {
  protected readonly copy = WAVE_PHOTOGRAPHY;
  protected readonly definition = LIP_DEFINITION;
  protected readonly waves = artworksIn('lips');
}
