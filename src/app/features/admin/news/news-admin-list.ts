import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News, NewsService } from '../../../data/news.service';
import { formatDateTime } from '../../../shared/format';

@Component({
  selector: 'app-news-admin-list',
  imports: [RouterLink],
  template: `
    <div class="head">
      <h1>News verwalten</h1>
      <a routerLink="/admin/news/neu" class="btn">Neuer Beitrag</a>
    </div>

    @if (message()) {
      <p class="alert" [class.alert-error]="message()!.error" role="status">
        {{ message()!.text }}
      </p>
    }

    @if (news.isLoading()) {
      <p aria-live="polite">Wird geladen …</p>
    } @else if (news.error()) {
      <p class="alert alert-error" role="alert">Die Beiträge konnten nicht geladen werden.</p>
    } @else if (!news.value()?.length) {
      <p class="muted">Noch keine Beiträge vorhanden.</p>
    } @else {
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Titel</th>
              <th scope="col">Status</th>
              <th scope="col">Veröffentlicht</th>
              <th scope="col"><span class="visually-hidden">Aktionen</span></th>
            </tr>
          </thead>
          <tbody>
            @for (item of news.value(); track item.id) {
              <tr>
                <td>
                  <a [routerLink]="['/admin/news', item.id]">{{ item.title }}</a
                  ><br />
                  <span class="muted">/neues/{{ item.slug }}</span>
                </td>
                <td>
                  @if (item.status === 'published') {
                    <span class="badge badge-success">veröffentlicht</span>
                  } @else {
                    <span class="badge badge-warning">Entwurf</span>
                  }
                </td>
                <td>{{ formatDateTime(item.published_at) }}</td>
                <td>
                  <div class="actions">
                    <a [routerLink]="['/admin/news', item.id]" class="btn btn-secondary btn-small"
                      >Bearbeiten</a
                    >
                    <button
                      type="button"
                      class="btn btn-secondary btn-small"
                      (click)="togglePublish(item)"
                    >
                      {{ item.status === 'published' ? 'Zurückziehen' : 'Veröffentlichen' }}
                    </button>
                    <button type="button" class="btn btn-danger btn-small" (click)="remove(item)">
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: `
    .head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      h1 {
        margin: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsAdminList {
  private readonly newsService = inject(NewsService);
  protected readonly formatDateTime = formatDateTime;
  protected readonly news = resource({ loader: () => this.newsService.listAll() });
  protected readonly message = signal<{ text: string; error?: boolean } | null>(null);

  protected async togglePublish(item: News): Promise<void> {
    const publish = item.status !== 'published';
    try {
      // Beim Zurückziehen Datum behalten, beim (Wieder-)Veröffentlichen setzt die DB ggf. jetzt
      await this.newsService.update(item.id, { status: publish ? 'published' : 'draft' });
      this.message.set({
        text: publish
          ? `„${item.title}“ ist veröffentlicht.`
          : `„${item.title}“ wurde zurückgezogen.`,
      });
      this.news.reload();
    } catch {
      this.message.set({ text: 'Status konnte nicht geändert werden.', error: true });
    }
  }

  protected async remove(item: News): Promise<void> {
    if (!confirm(`Beitrag „${item.title}“ wirklich löschen?`)) return;
    try {
      await this.newsService.remove(item);
      this.message.set({ text: `„${item.title}“ wurde gelöscht.` });
      this.news.reload();
    } catch {
      this.message.set({ text: 'Beitrag konnte nicht gelöscht werden.', error: true });
    }
  }
}
