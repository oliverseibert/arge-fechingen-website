import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EVENT_CATEGORIES, EventItem, EventsService } from '../../../data/events.service';
import { formatDateTime } from '../../../shared/format';

@Component({
  selector: 'app-events-admin-list',
  imports: [RouterLink],
  template: `
    <div class="head">
      <h1>Termine verwalten</h1>
      <a routerLink="/admin/termine/neu" class="btn">Neuer Termin</a>
    </div>

    @if (message()) {
      <p class="alert" [class.alert-error]="message()!.error" role="status">{{ message()!.text }}</p>
    }

    @if (events.isLoading()) {
      <p aria-live="polite">Wird geladen …</p>
    } @else if (events.error()) {
      <p class="alert alert-error" role="alert">Die Termine konnten nicht geladen werden.</p>
    } @else if (!events.value()?.length) {
      <p class="muted">Noch keine Termine vorhanden.</p>
    } @else {
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Beginn</th>
              <th scope="col">Titel</th>
              <th scope="col">Ort</th>
              <th scope="col">Kategorie</th>
              <th scope="col"><span class="visually-hidden">Aktionen</span></th>
            </tr>
          </thead>
          <tbody>
            @for (event of events.value(); track event.id) {
              <tr>
                <td>{{ formatDateTime(event.starts_at) }}</td>
                <td><a [routerLink]="['/admin/termine', event.id]">{{ event.title }}</a></td>
                <td>{{ event.location }}</td>
                <td>{{ categoryLabel(event) }}</td>
                <td>
                  <div class="actions">
                    <a [routerLink]="['/admin/termine', event.id]" class="btn btn-secondary btn-small">Bearbeiten</a>
                    <button type="button" class="btn btn-danger btn-small" (click)="remove(event)">Löschen</button>
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
export class EventsAdminList {
  private readonly eventsService = inject(EventsService);
  protected readonly formatDateTime = formatDateTime;
  protected readonly events = resource({ loader: () => this.eventsService.listAll() });
  protected readonly message = signal<{ text: string; error?: boolean } | null>(null);

  protected categoryLabel(event: EventItem): string {
    return EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? event.category;
  }

  protected async remove(event: EventItem): Promise<void> {
    if (!confirm(`Termin „${event.title}“ wirklich löschen?`)) return;
    try {
      await this.eventsService.remove(event.id);
      this.message.set({ text: `„${event.title}“ wurde gelöscht.` });
      this.events.reload();
    } catch {
      this.message.set({ text: 'Termin konnte nicht gelöscht werden.', error: true });
    }
  }
}
