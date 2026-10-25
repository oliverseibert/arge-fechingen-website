import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { CrestMark } from '../shared/crest-mark';
import { Icon } from '../shared/icon';
import { Brand } from './brand';
import { MAIN_NAV } from './header';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Brand, CrestMark, Icon],
  template: `
    <footer class="footer">
      <app-crest-mark class="watermark" />
      <div class="container grid-footer">
        <div class="about">
          <app-brand [inverse]="true" />
          <p>Neuigkeiten, Termine und Informationen rund um Fechingen.</p>
          <a class="mail" [href]="'mailto:' + email">
            <app-icon name="mail" />
            {{ email }}
          </a>
        </div>
        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav">Entdecken</h2>
          <ul>
            @for (item of nav; track item.path) {
              <li>
                <a [routerLink]="item.path">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal">
          <h2 id="footer-legal">Rechtliches</h2>
          <ul>
            <li><a routerLink="/impressum">Impressum</a></li>
            <li><a routerLink="/datenschutz">Datenschutz</a></li>
            <li><a routerLink="/admin">Verwaltung</a></li>
          </ul>
        </nav>
      </div>
      <div class="container bottom">
        <p>© {{ year }} ARGE – Arbeitsgemeinschaft Fechinger Ortsvereine e. V.</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      margin-top: auto;
      background:
        radial-gradient(50rem 30rem at 0% 0%, rgb(19 106 191 / 35%), transparent 70%),
        var(--color-navy);
      color: rgb(255 255 255 / 80%);
    }
    .watermark {
      position: absolute;
      z-index: -1;
      right: -4rem;
      top: -3rem;
      width: 22rem;
      height: 25rem;
      color: rgb(255 255 255 / 4%);
    }
    .grid-footer {
      display: grid;
      gap: var(--space-5);
      padding-block: var(--space-6) var(--space-5);
      @media (min-width: 48rem) {
        grid-template-columns: 2fr 1fr 1fr;
      }
    }
    .about p {
      margin: var(--space-3) 0;
      max-width: 22rem;
    }
    .mail {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-weight: 600;
    }
    h2 {
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: var(--space-3);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space-2);
    }
    a {
      color: rgb(255 255 255 / 80%);
      text-decoration: none;
      &:hover {
        color: var(--color-gold);
      }
    }
    .bottom {
      border-top: 1px solid rgb(255 255 255 / 12%);
      padding-block: var(--space-3);
      font-size: 0.875rem;
      color: rgb(255 255 255 / 55%);
      p {
        margin: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly email = environment.contactEmail;
  protected readonly nav = MAIN_NAV;
  protected readonly year = new Date().getFullYear();
}
