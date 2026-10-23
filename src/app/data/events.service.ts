import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../core/supabase.service';
import { SsrData } from '../core/ssr-data';
import { Enums, Tables, TablesInsert, TablesUpdate } from '../core/database.types';

export type EventItem = Tables<'events'>;
export type EventCategory = Enums<'event_category'>;

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'jubilaeum_2027', label: 'Jubiläum 2027' },
  { value: 'allgemein', label: 'Allgemein' },
];

export const TIME_ZONE = 'Europe/Berlin';

export interface EventMonthGroup {
  key: string;
  label: string;
  events: EventItem[];
}

/** Gruppiert Termine chronologisch nach Monat (Zeitzone Europe/Berlin). */
export function groupEventsByMonth(events: EventItem[]): EventMonthGroup[] {
  const keyFormat = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  });
  const labelFormat = new Intl.DateTimeFormat('de-DE', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'long',
  });
  const groups = new Map<string, EventMonthGroup>();

  for (const event of [...events].sort((a, b) => a.starts_at.localeCompare(b.starts_at))) {
    const date = new Date(event.starts_at);
    const key = keyFormat.format(date);
    let group = groups.get(key);
    if (!group) {
      group = { key, label: labelFormat.format(date), events: [] };
      groups.set(key, group);
    }
    group.events.push(event);
  }
  return [...groups.values()];
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly supabase = inject(SupabaseService);
  private readonly ssrData = inject(SsrData);

  listByCategory(category: EventCategory): Promise<EventItem[]> {
    return this.ssrData.load(`events:${category}`, async () => {
      const client = this.supabase.client;
      if (!client) return [];
      const { data, error } = await client
        .from('events')
        .select('*')
        .eq('category', category)
        .order('starts_at', { ascending: true });
      if (error) throw error;
      return data;
    });
  }

  // --- Admin ---

  async listAll(): Promise<EventItem[]> {
    const { data, error } = await this.supabase.required
      .from('events')
      .select('*')
      .order('starts_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<EventItem | null> {
    const { data, error } = await this.supabase.required
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(event: TablesInsert<'events'>): Promise<EventItem> {
    const { data, error } = await this.supabase.required
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, changes: TablesUpdate<'events'>): Promise<EventItem> {
    const { data, error } = await this.supabase.required
      .from('events')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.required.from('events').delete().eq('id', id);
    if (error) throw error;
  }
}
