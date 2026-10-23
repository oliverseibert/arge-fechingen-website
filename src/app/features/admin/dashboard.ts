import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <h1>Verwaltung</h1>
    <p>Willkommen{{ auth.profile()?.name ? ', ' + auth.profile()?.name : '' }}!</p>
    <ul class="grid tiles">
      <li class="card">
        <h2><a routerLink="/admin/news">News verwalten</a></h2>
        <p>Beiträge anlegen, bearbeiten und veröffentlichen.</p>
      </li>
      <li class="card">
        <h2><a routerLink="/admin/termine">Termine verwalten</a></h2>
        <p>Termine für das Jubiläum 2027 pflegen.</p>
      </li>
      @if (auth.isAdmin()) {
        <li class="card">
          <h2><a routerLink="/admin/newsletter">Newsletter-Abos</a></h2>
          <p>Abonnenten ansehen und als CSV exportieren.</p>
        </li>
        <li class="card">
          <h2><a routerLink="/admin/benutzer">Benutzer verwalten</a></h2>
          <p>Benutzer einladen, Rollen vergeben, deaktivieren.</p>
        </li>
      }
    </ul>
  `,
  styles: `
    .tiles {
      list-style: none;
      padding: 0;
    }
    h2 {
      margin-top: 0;
      font-size: 1.2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
}
