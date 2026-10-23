import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-datenschutz',
  imports: [Todo],
  template: `
    <article class="page container prose">
      <h1>Datenschutzerklärung</h1>
      <app-todo>
        Datenschutzerklärung einfügen. Zu berücksichtigen u. a.: Verantwortliche Stelle, Hosting
        (Vercel), Datenbank und Bildspeicher (Supabase), Newsletter mit Double-Opt-In (gespeichert
        werden E-Mail-Adresse, Zeitpunkt der Einwilligung und Bestätigung; Abmeldung jederzeit über
        den Link in jeder E-Mail), E-Mail-Versand (Dienstleister), Server-Logfiles, Rechte der
        Betroffenen.
      </app-todo>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datenschutz {
  constructor() {
    inject(SeoService).set({ title: 'Datenschutz', path: '/datenschutz' });
  }
}
