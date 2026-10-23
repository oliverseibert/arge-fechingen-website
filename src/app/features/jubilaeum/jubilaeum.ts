import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { EventsService, groupEventsByMonth } from '../../data/events.service';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';
import { formatDate, formatTime, formatWeekday } from '../../shared/format';

@Component({
  selector: 'app-jubilaeum',
  imports: [Todo],
  templateUrl: './jubilaeum.html',
  styleUrl: './jubilaeum.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Jubilaeum {
  private readonly eventsService = inject(EventsService);
  protected readonly formatWeekday = formatWeekday;
  protected readonly formatTime = formatTime;

  protected readonly events = resource({
    loader: () => this.eventsService.listByCategory('jubilaeum_2027'),
  });
  protected readonly months = computed(() => groupEventsByMonth(this.events.value() ?? []));

  constructor() {
    inject(SeoService).set({
      title: 'Jubiläum 2027',
      path: '/jubilaeum-2027',
      description: 'Alle Termine und Veranstaltungen zum Jubiläum 2027 in Fechingen.',
    });
  }

  /** Ende: nur Uhrzeit am selben Tag, sonst mit Datum */
  protected endLabel(start: string, end: string): string {
    const time = `${formatTime(end)} Uhr`;
    return formatDate(start) === formatDate(end) ? time : `${formatWeekday(end)}, ${time}`;
  }
}
