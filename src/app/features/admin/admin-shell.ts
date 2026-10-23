import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, ROLE_LABELS } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container admin">
      <aside class="side">
        <p class="user">
          <strong>{{ auth.profile()?.name || auth.profile()?.email }}</strong><br />
          <span class="badge">{{ roleLabel() }}</span>
        </p>
        <nav aria-label="Admin-Navigation">
          <ul>
            <li><a routerLink="/admin" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active" ariaCurrentWhenActive="page">Übersicht</a></li>
            <li><a routerLink="/admin/news" routerLinkActive="active" ariaCurrentWhenActive="page">News</a></li>
            <li><a routerLink="/admin/termine" routerLinkActive="active" ariaCurrentWhenActive="page">Termine</a></li>
            @if (auth.isAdmin()) {
              <li><a routerLink="/admin/newsletter" routerLinkActive="active" ariaCurrentWhenActive="page">Newsletter-Abos</a></li>
              <li><a routerLink="/admin/benutzer" routerLinkActive="active" ariaCurrentWhenActive="page">Benutzer</a></li>
            }
          </ul>
        </nav>
        <button type="button" class="btn btn-secondary btn-small" (click)="logout()">Abmelden</button>
      </aside>
      <section class="content">
        <router-outlet />
      </section>
    </div>
  `,
  styles: `
    .admin {
      display: grid;
      gap: var(--space-4);
      padding-block: var(--space-4) var(--space-6);
      @media (min-width: 56rem) {
        grid-template-columns: 14rem minmax(0, 1fr);
      }
    }
    .side {
      align-self: start;
      background: var(--color-surface);
      border-radius: var(--radius);
      padding: var(--space-3);
    }
    .user {
      overflow-wrap: anywhere;
    }
    ul {
      list-style: none;
      margin: 0 0 var(--space-3);
      padding: 0;
    }
    nav a {
      display: block;
      padding: var(--space-2);
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 600;
      color: var(--color-navy);
      &:hover {
        background: var(--color-blue-light);
      }
      &.active {
        background: var(--color-blue-dark);
        color: #fff;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    inject(SeoService).set({ title: 'Verwaltung', noindex: true });
  }

  protected roleLabel(): string {
    const role = this.auth.role();
    return role ? ROLE_LABELS[role] : '';
  }

  protected async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}
