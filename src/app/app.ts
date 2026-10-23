import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header';
import { Footer } from './layout/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
    <app-header />
    <main id="inhalt" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
      outline: none;
    }
    .skip-link {
      position: absolute;
      left: var(--space-3);
      top: -10rem;
      z-index: 100;
      padding: var(--space-2) var(--space-3);
      background: var(--color-navy);
      color: #fff;
      &:focus {
        top: var(--space-2);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) redirectAuthLinks();
  }
}

const AUTH_LINK_TYPES = ['invite', 'recovery', 'signup', 'magiclink'];
const SET_PASSWORD_PATH = '/admin/passwort-setzen';

/** Einladungs-/Reset-Links aus dem Supabase-Dashboard landen auf der Site URL: weiterleiten. */
function redirectAuthLinks(): void {
  if (location.pathname === SET_PASSWORD_PATH || !location.hash) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const isAuthLink =
    (params.has('access_token') && AUTH_LINK_TYPES.includes(params.get('type') ?? '')) ||
    params.has('error_code');
  if (isAuthLink) location.replace(SET_PASSWORD_PATH + location.hash);
}
