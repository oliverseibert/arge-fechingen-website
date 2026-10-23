import { ChangeDetectionStrategy, Component, RESPONSE_INIT, effect, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../data/news.service';
import { SupabaseService } from '../../core/supabase.service';
import { SeoService } from '../../core/seo.service';
import { MarkdownPipe } from '../../shared/markdown.pipe';
import { formatDate } from '../../shared/format';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, MarkdownPipe],
  template: `
    <article class="page container prose">
      <p><a routerLink="/neues">← Alle Neuigkeiten</a></p>
      @if (news.isLoading()) {
        <p aria-live="polite">Wird geladen …</p>
      } @else if (news.error()) {
        <p class="alert alert-error" role="alert">Der Beitrag konnte nicht geladen werden.</p>
      } @else {
        @if (news.value(); as item) {
          <h1>{{ item.title }}</h1>
          <p class="muted"><time [attr.datetime]="item.published_at">{{ formatDate(item.published_at) }}</time></p>
          @if (supabase.publicImageUrl(item.image_path); as src) {
            <img class="image" [src]="src" [alt]="item.image_alt ?? ''" width="1200" height="675" />
          }
          @if (item.teaser) {
            <p class="lead">{{ item.teaser }}</p>
          }
          <div class="content" [innerHTML]="item.content | markdown"></div>
        } @else {
          <h1>Beitrag nicht gefunden</h1>
          <p>Diesen Beitrag gibt es nicht oder er ist nicht mehr verfügbar.</p>
        }
      }
    </article>
  `,
  styles: `
    .image {
      width: 100%;
      border-radius: var(--radius);
      margin-bottom: var(--space-4);
    }
    .content :is(img) {
      border-radius: var(--radius);
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
