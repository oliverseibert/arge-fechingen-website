import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SupabaseService } from '../../../core/supabase.service';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card auth">
        <h1>Anmelden</h1>
        @if (!supabase.configured) {
          <p class="alert alert-error" role="alert">Supabase ist nicht konfiguriert (SUPABASE_URL / SUPABASE_ANON_KEY).</p>
        }
        @if (fehler() === 'keine-rolle') {
          <p class="alert alert-error" role="alert">Ihr Konto ist nicht (mehr) freigeschaltet. Bitte wenden Sie sich an einen Admin.</p>
        }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-field">
            <label for="login-email">E-Mail-Adresse</label>
            <input id="login-email" type="email" formControlName="email" autocomplete="username" required />
          </div>
          <div class="form-field">
            <label for="login-password">Passwort</label>
            <input id="login-password" type="password" formControlName="password" autocomplete="current-password" required />
          </div>
          @if (error()) {
            <p class="alert alert-error" role="alert">{{ error() }}</p>
          }
          <button type="submit" class="btn" [disabled]="form.invalid || busy()">{{ busy() ? 'Anmelden …' : 'Anmelden' }}</button>
        </form>
        <p class="links"><a routerLink="/admin/passwort-vergessen">Passwort vergessen?</a></p>
      </div>
    </div>
  `,
  styleUrl: './auth-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly supabase = inject(SupabaseService);

  readonly redirect = input<string>();
  readonly fehler = input<string>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  constructor() {
    inject(SeoService).set({ title: 'Anmelden', noindex: true });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.signIn(email, password);
      if (!this.auth.role()) {
        await this.auth.signOut();
        this.error.set('Ihr Konto ist nicht freigeschaltet. Bitte wenden Sie sich an einen Admin.');
        return;
      }
      const target = this.redirect()?.startsWith('/admin') ? this.redirect()! : '/admin';
      await this.router.navigateByUrl(target);
    } catch {
      this.error.set('Anmeldung fehlgeschlagen. Bitte prüfen Sie E-Mail-Adresse und Passwort.');
    } finally {
      this.busy.set(false);
    }
  }
}
