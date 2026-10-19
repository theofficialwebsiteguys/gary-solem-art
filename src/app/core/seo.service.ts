import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../content/site.config';

export interface PageMeta {
  title: string;
  description: string;
  /** Route path, e.g. "/my-art". Used for the canonical URL. */
  path: string;
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(page: PageMeta): void {
    const url = SITE.origin + (page.path === '/' ? '/' : page.path);
    const image = SITE.origin + SITE.socialImage.path;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: String(SITE.socialImage.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(SITE.socialImage.height) });
    this.meta.updateTag({ property: 'og:image:alt', content: SITE.socialImage.alt });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setCanonical(page.noindex ? null : url);

    const indexable = !page.noindex && this.isProductionHost();
    if (indexable) {
      this.meta.removeTag('name="robots"');
    } else {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
    }
  }

  /** Preview and staging hosts are kept out of search results. */
  private isProductionHost(): boolean {
    const host = this.document.location?.hostname ?? '';
    return (SITE.indexableHosts as readonly string[]).includes(host);
  }

  private setCanonical(url: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      head.appendChild(link);
    }
    link.href = url;
  }
}
