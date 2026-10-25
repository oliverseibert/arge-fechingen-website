import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-datenschutz',
  imports: [PageHeader, Todo],
  template: `
    <app-page-header title="Datenschutzerklärung" />
    <div class="container section">
      <article class="prose">
        <app-todo>
          Datenschutzerklärung einfügen. Zu berücksichtigen u. a.: Verantwortliche Stelle, Hosting
          (Vercel), Datenbank und Bildspeicher (Supabase), Newsletter mit Double-Opt-In (gespeichert
          werden E-Mail-Adresse, Zeitpunkt der Einwilligung und Bestätigung; Abmeldung jederzeit
          über den Link in jeder E-Mail), E-Mail-Versand (Dienstleister), Server-Logfiles, Rechte
          der Betroffenen.
        </app-todo>
      </article>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datenschutz {
  constructor() {
    inject(SeoService).set({ title: 'Datenschutz', path: '/datenschutz' });
  }
}
