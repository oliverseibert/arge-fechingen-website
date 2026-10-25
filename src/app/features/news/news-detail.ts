import {
  ChangeDetectionStrategy,
  Component,
  RESPONSE_INIT,
  effect,
  inject,
  input,
  resource,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../data/news.service';
import { SupabaseService } from '../../core/supabase.service';
import { SeoService } from '../../core/seo.service';
import { MarkdownPipe } from '../../shared/markdown.pipe';
import { formatDate } from '../../shared/format';
import { Icon } from '../../shared/icon';
import { Crumb, PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, MarkdownPipe, PageHeader, Icon],
  template: `
    @if (news.isLoading()) {
      <div class="container section"><p aria-live="polite">Wird geladen …</p></div>
    } @else if (news.error()) {
      <div class="container section">
        <p class="alert alert-error" role="alert">Der Beitrag konnte nicht geladen werden.</p>
      </div>
    } @else {
      @if (news.value(); as item) {
        <app-page-header
          [title]="item.title"
          [eyebrow]="formatDate(item.published_at)"
          [intro]="item.teaser ?? undefined"
          [crumbs]="crumbs"
        />
        <article class="container section">
          @if (supabase.publicImageUrl(item.image_path); as src) {
            <img class="image" [src]="src" [alt]="item.image_alt ?? ''" width="1200" height="675" />
          }
          <div class="prose content" [innerHTML]="item.content | markdown"></div>
          <p class="back">
            <a routerLink="/neues" class="btn btn-secondary">
              <app-icon name="arrow-right" class="flip" />
              Alle Neuigkeiten
            </a>
          </p>
        </article>
      } @else {
        <app-page-header title="Beitrag nicht gefunden" [crumbs]="crumbs" />
        <div class="container section">
          <p>Diesen Beitrag gibt es nicht oder er ist nicht mehr verfügbar.</p>
          <a routerLink="/neues" class="btn">Alle Neuigkeiten</a>
        </div>
      }
    }
  `,
  styles: `
    .image {
      display: block;
      width: 100%;
      max-width: 60rem;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lift);
      margin-bottom: var(--space-5);
    }
    .content {
      font-size: 1.075rem;
    }
    .back {
      margin-top: var(--space-5);
    }
    .flip {
      transform: rotate(180deg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetail {
  private readonly newsService = inject(NewsService);
  private readonly seo = inject(SeoService);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  protected readonly supabase = inject(SupabaseService);
  protected readonly formatDate = formatDate;
  protected readonly crumbs: Crumb[] = [{ label: 'Neues', link: '/neues' }];

  readonly slug = input.required<string>();

  protected readonly news = resource({
    params: () => this.slug(),
    loader: ({ params }) => this.newsService.getPublishedBySlug(params),
  });

  constructor() {
    effect(() => {
      if (this.news.isLoading()) return;
      const item = this.news.value();
      if (item) {
        this.seo.set({
          title: item.title,
          description: item.teaser ?? undefined,
          image: this.supabase.publicImageUrl(item.image_path),
          path: `/neues/${item.slug}`,
          type: 'article',
        });
      } else {
        this.seo.set({ title: 'Beitrag nicht gefunden', noindex: true });
        // SSR: echter 404-Status für Suchmaschinen
        if (this.responseInit && !this.news.error()) this.responseInit.status = 404;
      }
    });
  }
}
