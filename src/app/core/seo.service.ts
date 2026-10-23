import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

const SITE_NAME = 'ARGE Fechingen';
const DEFAULT_IMAGE = '/assets/logo/og-image.jpg';

export interface SeoData {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(data: SeoData): void {
    const fullTitle = data.title ? `${data.title} | ${SITE_NAME}` : SITE_NAME;
    const url = environment.siteUrl + (data.path ?? '');
    const image = data.image ?? environment.siteUrl + DEFAULT_IMAGE;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ property: 'og:description', content: data.description });
    }
    this.meta.updateTag({ name: 'robots', content: data.noindex ? 'noindex, nofollow' : 'index, follow' });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
