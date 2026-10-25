import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';
import { CLUB_ACTIVITIES, CLUBS, ClubActivity, WEEKDAYS } from './vereine.data';

@Component({
  selector: 'app-vereine',
  imports: [PageHeader, Icon, Todo],
  templateUrl: './vereine.html',
  styleUrl: './vereine.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vereine {
  protected readonly clubs = CLUBS;
  protected readonly weekdays = WEEKDAYS;
  protected readonly activities = [...CLUB_ACTIVITIES].sort(
    (a, b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time),
  );
  private readonly clubNames = new Map(CLUBS.map((c) => [c.id, c.name]));

  constructor() {
    inject(SeoService).set({
      title: 'Vereine',
      path: '/vereine',
      description: 'Die Fechinger Vereine mit Kontaktdaten, Trainings und Proben.',
    });
  }

  protected clubName(activity: ClubActivity): string {
    return this.clubNames.get(activity.club_id) ?? '';
  }

  protected timeRange(activity: ClubActivity): string {
    return activity.end_time
      ? `${activity.start_time}–${activity.end_time} Uhr`
      : `ab ${activity.start_time} Uhr`;
  }
}
