import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../data/news.service';
import { SupabaseService } from '../../core/supabase.service';
import { SeoService } from '../../core/seo.service';
import { formatDate } from '../../shared/format';
import { CrestMark } from '../../shared/crest-mark';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';
import { NewsletterForm } from '../newsletter/newsletter-form';

@Component({
  selector: 'app-news-list',
  imports: [RouterLink, NewsletterForm, PageHeader, Icon, CrestMark],
  templateUrl: './news-list.html',
  styleUrl: './news-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsList {
  private readonly newsService = inject(NewsService);
  protected readonly supabase = inject(SupabaseService);
  protected readonly formatDate = formatDate;

  protected readonly news = resource({ loader: () => this.newsService.listPublished() });

  constructor() {
    inject(SeoService).set({
      title: 'Neues',
      path: '/neues',
      description: 'Aktuelle Neuigkeiten der ARGE Fechingen.',
    });
  }
}
