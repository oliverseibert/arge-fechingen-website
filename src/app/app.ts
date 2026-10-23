import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class App {}
