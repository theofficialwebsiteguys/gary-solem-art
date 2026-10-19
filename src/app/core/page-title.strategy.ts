import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE } from '../content/site.config';
import { SeoService } from './seo.service';

/** Route data used for page metadata. */
export interface PageData {
  description?: string;
  noindex?: boolean;
}

/** Builds "<Page> · Gary Solem Art" titles and keeps description, canonical and social tags in sync. */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;

    const pageTitle = this.buildTitle(snapshot);
    const data = route.data as PageData;
    const path = '/' + route.pathFromRoot.flatMap((r) => r.url.map((s) => s.path)).join('/');

    this.seo.update({
      title: pageTitle && pageTitle !== SITE.name ? `${pageTitle} · ${SITE.name}` : SITE.name,
      description: data.description ?? SITE.defaultDescription,
      path,
      noindex: data.noindex,
    });
  }
}
