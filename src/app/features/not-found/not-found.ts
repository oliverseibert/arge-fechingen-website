import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PageHeader],
  template: `
    <app-page-header title="Seite nicht" accent="gefunden" />
    <div class="container section">
      <div class="prose">
        <p>Die gesuchte Seite gibt es leider nicht (mehr).</p>
        <a routerLink="/" class="btn">Zur Startseite</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  constructor() {
    inject(SeoService).set({ title: 'Seite nicht gefunden', noindex: true });
  }
}
