import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-arge',
  imports: [Todo],
  template: `
    <article class="page container prose">
      <h1>Die ARGE</h1>
      <p class="lead">Die Arbeitsgemeinschaft Fechingen stellt sich vor.</p>

      <h2>Chronik</h2>
      <app-todo>Chronik von Günter Nieser einfügen</app-todo>
    </article>
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
