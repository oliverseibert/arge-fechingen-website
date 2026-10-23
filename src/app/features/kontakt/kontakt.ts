import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-kontakt',
  template: `
    <article class="page container prose">
      <h1>Kontakt</h1>
      <p>Sie erreichen die ARGE Fechingen per E-Mail:</p>
      <p class="mail">
        <a [href]="'mailto:' + email">{{ email }}</a>
      </p>
    </article>
  `,
  styles: `
    .mail {
      font-size: 1.35rem;
      font-weight: 700;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kontakt {
  protected readonly email = environment.contactEmail;

  constructor() {
    inject(SeoService).set({ title: 'Kontakt', path: '/kontakt', description: 'So erreichen Sie die ARGE Fechingen.' });
  }
}
