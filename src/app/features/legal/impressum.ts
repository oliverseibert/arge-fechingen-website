import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-impressum',
  imports: [PageHeader, Todo],
  template: `
    <app-page-header title="Impressum" />
    <div class="container section">
      <article class="prose">
        <app-todo>
          Impressum einfügen: Vereinsname und Anschrift, vertretungsberechtigter Vorstand, Kontakt,
          ggf. Registergericht und Registernummer, inhaltlich Verantwortliche/r nach § 18 Abs. 2
          MStV.
        </app-todo>
      </article>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Impressum {
  constructor() {
    inject(SeoService).set({ title: 'Impressum', path: '/impressum' });
  }
}
