import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-impressum',
  imports: [Todo],
  template: `
    <article class="page container prose">
      <h1>Impressum</h1>
      <app-todo>
        Impressum einfügen: Vereinsname und Anschrift, vertretungsberechtigter Vorstand, Kontakt,
        ggf. Registergericht und Registernummer, inhaltlich Verantwortliche/r nach § 18 Abs. 2 MStV.
      </app-todo>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Impressum {
  constructor() {
    inject(SeoService).set({ title: 'Impressum', path: '/impressum' });
  }
}
