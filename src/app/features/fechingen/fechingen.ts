import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-fechingen',
  imports: [Todo],
  template: `
    <article class="page container prose">
      <h1>Fechingen</h1>

      <section aria-labelledby="dorf">
        <h2 id="dorf">Über das Dorf</h2>
        <app-todo>Text „Über das Dorf“ einfügen (ggf. mit Bildern)</app-todo>
      </section>

      <section aria-labelledby="gaensegretel">
        <h2 id="gaensegretel">Gänsegretelgeschichte</h2>
        <app-todo>Gänsegretelgeschichte einfügen</app-todo>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fechingen {
  constructor() {
    inject(SeoService).set({ title: 'Fechingen', path: '/fechingen', description: 'Über das Dorf Fechingen und die Geschichte der Gänsegretel.' });
  }
}
