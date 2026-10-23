import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <p class="name">
          <img src="/assets/logo/wappen-fechingen.png" alt="" width="32" height="36" />
          ARGE Fechingen
        </p>
        <nav aria-label="Rechtliches und Kontakt">
          <ul>
            <li><a routerLink="/impressum">Impressum</a></li>
            <li><a routerLink="/datenschutz">Datenschutz</a></li>
            <li><a [href]="'mailto:' + email">{{ email }}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--color-navy);
      color: #fff;
      padding-block: var(--space-4);
      margin-top: auto;
    }
    .footer-inner {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      align-items: center;
      justify-content: space-between;
    }
    .name {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
      font-weight: 700;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-4);
      list-style: none;
      margin: 0;
      padding: 0;
    }
    a {
      color: #fff;
      &:hover {
        color: var(--color-gold);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly email = environment.contactEmail;
}
