import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export const MAIN_NAV = [
  { path: '/neues', label: 'Neues' },
  { path: '/die-arge', label: 'Die ARGE' },
  { path: '/vorstand', label: 'Der Vorstand' },
  { path: '/fechingen', label: 'Fechingen' },
  { path: '/vereine', label: 'Vereine' },
  { path: '/jubilaeum-2027', label: 'Jubiläum 2027' },
  { path: '/kontakt', label: 'Kontakt' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-inner">
        <a routerLink="/" class="logo" aria-label="ARGE Fechingen – zur Startseite">
          <img src="/assets/logo/arge-fechingen-logo-klein.webp" alt="" width="480" height="312" />
        </a>

        <button
          type="button"
          class="burger"
          [attr.aria-expanded]="open()"
          aria-controls="main-nav"
          (click)="open.set(!open())"
        >
          <span class="burger-icon" aria-hidden="true"></span>
          <span class="visually-hidden">{{ open() ? 'Menü schließen' : 'Menü öffnen' }}</span>
        </button>

        <nav id="main-nav" class="nav" [class.open]="open()" aria-label="Hauptnavigation">
          <ul>
            @for (item of nav; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  ariaCurrentWhenActive="page"
                  >{{ item.label }}</a
                >
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Header {
  protected readonly nav = MAIN_NAV;
  protected readonly open = signal(false);

  constructor() {
    // Menü nach Navigation schließen
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }
}
