import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { Icon, IconName } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';

interface Item {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-arge',
  imports: [PageHeader, Todo, Icon, RouterLink],
  templateUrl: './arge.html',
  styleUrl: './arge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Arge {
  // Zweck laut Satzung, Quelle: Stadtteilporträt Fechingen der Landeshauptstadt Saarbrücken
  protected readonly goals: Item[] = [
    {
      icon: 'sparkles',
      title: 'Kultur, Kunst und Brauchtum',
      text: 'Die ARGE pflegt Kultur, Kunst und Brauchtum im Ort.',
    },
    {
      icon: 'landmark',
      title: 'Kulturdenkmäler',
      text: 'Sie kümmert sich um die Erhaltung und Betreuung von Kulturdenkmälern in Fechingen.',
    },
    {
      icon: 'newspaper',
      title: 'Ortsgeschichte',
      text: 'Sie erforscht und dokumentiert die Geschichte des Dorfes.',
    },
    {
      icon: 'calendar',
      title: 'Veranstaltungen',
      text: 'Sie richtet kulturelle Veranstaltungen und Feste für das ganze Dorf aus.',
    },
  ];

  protected readonly events: Item[] = [
    {
      icon: 'calendar',
      title: 'Feier zum 1. Mai',
      text: 'Die traditionelle Feier der ARGE am 1. Mai.',
    },
    { icon: 'users', title: 'Kirmes', text: 'Die Fechinger Kirmes im Herbst.' },
    {
      icon: 'sparkles',
      title: 'Weihnachtsmarkt',
      text: 'Auf dem Festplatz bei der Freiwilligen Feuerwehr Fechingen.',
    },
  ];

  protected readonly projects: Item[] = [
    {
      icon: 'map-pin',
      title: 'Gänsegretelbrunnen',
      text: '1985 fertiggestellt, am Fuße des Kirchbergs – zur Erinnerung an die Gänsegretel.',
    },
    {
      icon: 'map-pin',
      title: 'Ortsschilder „Gänsegreteldorf“',
      text: 'In den 1990er Jahren an den vier Ortseingängen aufgestellt.',
    },
    {
      icon: 'map-pin',
      title: 'Giesebrunnen im Brühl',
      text: 'Der um 1800 angelegte Brunnen wurde 1997 von der ARGE wieder instand gesetzt.',
    },
    {
      icon: 'map-pin',
      title: 'Ruhebänke',
      text: 'An ausgewählten Stellen auf Fechinger Bann – mit Blick auf Felder, Wald und Hügel.',
    },
    {
      icon: 'newspaper',
      title: 'Heimatgeschichtlicher Arbeitskreis',
      text: 'Der Arbeitskreis in der ARGE hat unter anderem Infotafeln zu den mittelalterlichen Wüstungen Benningen und Friedrichingen aufgestellt.',
    },
  ];

  constructor() {
    inject(SeoService).set({
      title: 'Die ARGE',
      path: '/die-arge',
      description:
        'Die ARGE – Arbeitsgemeinschaft Fechinger Ortsvereine e. V.: gemeinnütziger Zusammenschluss der Fechinger Vereine für Kultur, Brauchtum und Ortsgeschichte.',
    });
  }
}
