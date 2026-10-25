import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { CrestMark } from '../../shared/crest-mark';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';
import { FACTS, SIGHTS, SOURCES, TIMELINE } from './fechingen.data';

@Component({
  selector: 'app-fechingen',
  imports: [PageHeader, RouterLink, CrestMark, Icon],
  templateUrl: './fechingen.html',
  styleUrl: './fechingen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fechingen {
  protected readonly facts = FACTS;
  protected readonly timeline = TIMELINE;
  protected readonly sights = SIGHTS;
  protected readonly sources = SOURCES;

  constructor() {
    inject(SeoService).set({
      title: 'Fechingen',
      path: '/fechingen',
      description:
        'Fechingen – seit 777 urkundlich erwähnt, 2027 feiert das Dorf 1250 Jahre. Geschichte, Kirche auf dem Kirchberg, Sehenswertes und die Lebensgeschichte der „Gänsegretel“ Katharina Margaretha Kest.',
    });
  }
}
