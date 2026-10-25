import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { CrestMark } from '../../shared/crest-mark';
import { Icon, IconName } from '../../shared/icon';

interface QuickLink {
  path: string;
  title: string;
  text: string;
  icon: IconName;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CrestMark, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly links: QuickLink[] = [
    {
      path: '/neues',
      title: 'Neues',
      text: 'Aktuelle Neuigkeiten aus der ARGE.',
      icon: 'newspaper',
    },
    {
      path: '/jubilaeum-2027',
      title: 'Jubiläum 2027',
      text: 'Alle Termine zum Jubiläum im Überblick.',
      icon: 'sparkles',
    },
    {
      path: '/vereine',
      title: 'Vereine',
      text: 'Vereine, Trainings und Proben in Fechingen.',
      icon: 'users',
    },
    {
      path: '/die-arge',
      title: 'Die ARGE',
      text: 'Geschichte und Chronik der ARGE.',
      icon: 'landmark',
    },
  ];

  constructor() {
    inject(SeoService).set({
      path: '/',
      description:
        'Die ARGE (Arbeitsgemeinschaft) Fechingen – Neuigkeiten, Termine und Informationen rund um Fechingen.',
    });
  }
}
