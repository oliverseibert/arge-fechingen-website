import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { PageHeader } from '../../shared/page-header';
import { Icon } from '../../shared/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-kontakt',
  imports: [PageHeader, Icon],
  template: `
    <app-page-header
      crumbLabel="Kontakt"
      title="Schreiben Sie"
      accent="uns"
      intro="Sie erreichen die ARGE Fechingen per E-Mail."
    />
    <div class="container section">
      <div class="card contact">
        <span class="icon-tile"><app-icon name="mail" /></span>
        <div>
          <h2>E-Mail</h2>
          <a class="address" [href]="'mailto:' + email">{{ email }}</a>
        </div>
        <a class="btn btn-lg" [href]="'mailto:' + email">
          E-Mail schreiben
          <app-icon name="arrow-right" />
        </a>
      </div>
    </div>
  `,
  styles: `
    .contact {
      display: grid;
      gap: var(--space-4);
      align-items: center;
      max-width: 48rem;
      padding: clamp(1.5rem, 4vw, 2.5rem);
      @media (min-width: 40rem) {
        grid-template-columns: auto 1fr auto;
      }
    }
    h2 {
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-1);
    }
    .address {
      font-size: clamp(1.15rem, 1rem + 1vw, 1.5rem);
      font-weight: 700;
      color: var(--color-navy);
      text-decoration: none;
      overflow-wrap: anywhere;
      &:hover {
        color: var(--color-primary);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kontakt {
  protected readonly email = environment.contactEmail;

  constructor() {
    inject(SeoService).set({
      title: 'Kontakt',
      path: '/kontakt',
      description: 'So erreichen Sie die ARGE Fechingen.',
    });
  }
}
