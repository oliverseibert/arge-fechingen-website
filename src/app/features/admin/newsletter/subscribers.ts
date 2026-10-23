import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { SupabaseService } from '../../../core/supabase.service';
import { Enums, Tables } from '../../../core/database.types';
import { formatDateTime } from '../../../shared/format';

type Subscriber = Tables<'newsletter_subscribers'>;
type Status = Enums<'subscriber_status'>;

const STATUS_LABELS: Record<Status, string> = {
  pending: 'unbestätigt',
  confirmed: 'bestätigt',
  unsubscribed: 'abgemeldet',
};

@Component({
  selector: 'app-subscribers',
  template: `
    <div class="head">
      <h1>Newsletter-Abos</h1>
      <div class="actions">
        <label for="sub-filter" class="visually-hidden">Status filtern</label>
        <select id="sub-filter" [value]="filter()" (change)="filter.set($any($event.target).value)">
          <option value="all">Alle</option>
          <option value="confirmed">Bestätigt</option>
          <option value="pending">Unbestätigt</option>
          <option value="unsubscribed">Abgemeldet</option>
        </select>
        <button type="button" class="btn" [disabled]="!filtered().length" (click)="exportCsv()">
          CSV exportieren
        </button>
      </div>
    </div>

    @if (subscribers.isLoading()) {
      <p aria-live="polite">Wird geladen …</p>
    } @else if (subscribers.error()) {
      <p class="alert alert-error" role="alert">Die Abonnenten konnten nicht geladen werden.</p>
    } @else {
      <p class="muted">{{ filtered().length }} Einträge · {{ confirmedCount() }} bestätigt</p>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">E-Mail</th>
              <th scope="col">Status</th>
              <th scope="col">Eingetragen</th>
              <th scope="col">Bestätigt</th>
            </tr>
          </thead>
          <tbody>
            @for (s of filtered(); track s.id) {
              <tr>
                <td>{{ s.email }}</td>
                <td>
                  <span
                    class="badge"
                    [class.badge-success]="s.status === 'confirmed'"
                    [class.badge-warning]="s.status === 'pending'"
                  >
                    {{ statusLabel(s.status) }}
                  </span>
                </td>
                <td>{{ formatDateTime(s.created_at) }}</td>
                <td>{{ formatDateTime(s.confirmed_at) }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="muted">Keine Einträge.</td>
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
      select {
        width: auto;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Subscribers {
  private readonly supabase = inject(SupabaseService);
  protected readonly formatDateTime = formatDateTime;
  protected readonly filter = signal<Status | 'all'>('all');

  protected readonly subscribers = resource({
    loader: async (): Promise<Subscriber[]> => {
      const { data, error } = await this.supabase.required
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  protected readonly filtered = computed(() => {
    const all = this.subscribers.value() ?? [];
    const filter = this.filter();
    return filter === 'all' ? all : all.filter((s) => s.status === filter);
  });
  protected readonly confirmedCount = computed(
    () => (this.subscribers.value() ?? []).filter((s) => s.status === 'confirmed').length,
  );

  protected statusLabel(status: Status): string {
    return STATUS_LABELS[status];
  }

  protected exportCsv(): void {
    const escape = (v: string | null) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const header = ['E-Mail', 'Status', 'Eingetragen', 'Einwilligung', 'Bestätigt', 'Abgemeldet'];
    const rows = this.filtered().map((s) =>
      [
        s.email,
        STATUS_LABELS[s.status],
        s.created_at,
        s.consent_at,
        s.confirmed_at,
        s.unsubscribed_at,
      ]
        .map(escape)
        .join(';'),
    );
    // BOM + Semikolon: öffnet korrekt in deutschem Excel
    const csv = '﻿' + [header.map(escape).join(';'), ...rows].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-abos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
