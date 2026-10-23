import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card auth">
        <h1>Passwort vergessen</h1>
        @if (sent()) {
          <p class="alert alert-success" role="status">
            Falls ein Konto zu dieser Adresse existiert, haben wir eine E-Mail mit einem Link zum
            Zurücksetzen geschickt.
          </p>
        } @else {
          <p>
            Geben Sie Ihre E-Mail-Adresse ein. Sie erhalten einen Link, um ein neues Passwort zu
            setzen.
          </p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-field">
              <label for="fp-email">E-Mail-Adresse</label>
              <input
                id="fp-email"
                type="email"
                formControlName="email"
                autocomplete="email"
                required
              />
            </div>
            @if (error()) {
              <p class="alert alert-error" role="alert">{{ error() }}</p>
            }
            <button type="submit" class="btn" [disabled]="form.invalid || busy()">
              Link anfordern
            </button>
          </form>
        }
        <p class="links"><a routerLink="/admin/login">Zurück zur Anmeldung</a></p>
      </div>
    </div>
  `,
  styleUrl: './auth-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  protected readonly busy = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  constructor() {
    inject(SeoService).set({ title: 'Passwort vergessen', noindex: true });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.sendPasswordReset(this.form.getRawValue().email);
      this.sent.set(true);
    } catch {
      this.error.set(
        'Der Link konnte nicht angefordert werden. Bitte versuchen Sie es später erneut.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
