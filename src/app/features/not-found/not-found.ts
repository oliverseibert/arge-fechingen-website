import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <article class="page container prose">
      <h1>Seite nicht gefunden</h1>
      <p>Die gesuchte Seite gibt es leider nicht (mehr).</p>
      <p><a routerLink="/">Zur Startseite</a></p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  constructor() {
    inject(SeoService).set({ title: 'Seite nicht gefunden', noindex: true });
  }
}
