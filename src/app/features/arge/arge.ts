import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-arge',
  imports: [PageHeader, Todo],
  template: `
    <app-page-header
      crumbLabel="Die ARGE"
      title="Die"
      accent="ARGE"
      intro="Die Arbeitsgemeinschaft Fechingen stellt sich vor."
    />
    <div class="container section">
      <article class="prose">
        <span class="eyebrow">Geschichte</span>
        <h2 class="section-title">Chronik</h2>
        <app-todo>Chronik von Günter Nieser einfügen</app-todo>
      </article>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Arge {
  constructor() {
    inject(SeoService).set({
      title: 'Die ARGE',
      path: '/die-arge',
      description: 'Geschichte und Chronik der ARGE Fechingen.',
    });
  }
}
