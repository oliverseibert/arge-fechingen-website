import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-fechingen',
  imports: [PageHeader, Todo],
  template: `
    <app-page-header
      crumbLabel="Fechingen"
      title="Über"
      accent="Fechingen"
      intro="Das Dorf und die Geschichte der Gänsegretel."
    />
    <div class="container section sections">
      <section class="card" aria-labelledby="dorf">
        <span class="eyebrow">Das Dorf</span>
        <h2 id="dorf">Über das Dorf</h2>
        <app-todo>Text „Über das Dorf“ einfügen (ggf. mit Bildern)</app-todo>
      </section>
      <section class="card" aria-labelledby="gaensegretel">
        <span class="eyebrow">Sage</span>
        <h2 id="gaensegretel">Gänsegretelgeschichte</h2>
        <app-todo>Gänsegretelgeschichte einfügen</app-todo>
      </section>
    </div>
  `,
  styles: `
    .sections {
      display: grid;
      gap: var(--space-4);
      @media (min-width: 56rem) {
        grid-template-columns: 1fr 1fr;
      }
    }
    .card {
      padding: clamp(1.5rem, 3vw, 2.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fechingen {
  constructor() {
    inject(SeoService).set({
      title: 'Fechingen',
      path: '/fechingen',
      description: 'Über das Dorf Fechingen und die Geschichte der Gänsegretel.',
    });
  }
}
