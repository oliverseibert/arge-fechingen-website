import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  selector: 'app-newsletter-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @if (state() === 'success') {
      <p class="alert alert-success" role="status">
        Fast geschafft! Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie Ihre Anmeldung über den Link darin.
      </p>
    } @else {
      <p>Erhalten Sie Neuigkeiten der ARGE Fechingen per E-Mail.</p>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-field">
          <label for="nl-email">E-Mail-Adresse</label>
          <input
            id="nl-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            required
            [attr.aria-invalid]="showError('email')"
            [attr.aria-describedby]="showError('email') ? 'nl-email-error' : null"
          />
          @if (showError('email')) {
            <span id="nl-email-error" class="error">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
          }
        </div>

        <!-- Honeypot gegen Spam-Bots -->
        <div class="hp" aria-hidden="true">
          <label for="nl-website">Website</label>
          <input id="nl-website" type="text" formControlName="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-field">
          <label class="checkbox" for="nl-consent">
            <input
              id="nl-consent"
              type="checkbox"
              formControlName="consent"
              required
              [attr.aria-invalid]="showError('consent')"
              [attr.aria-describedby]="showError('consent') ? 'nl-consent-error' : null"
            />
            <span class="consent-text">
              Ich möchte den Newsletter erhalten und willige ein, dass meine E-Mail-Adresse dafür gespeichert wird. Hinweise
              in der <a routerLink="/datenschutz">Datenschutzerklärung</a>. Abmeldung jederzeit möglich.
            </span>
          </label>
          @if (showError('consent')) {
            <span id="nl-consent-error" class="error">Bitte bestätigen Sie die Einwilligung.</span>
          }
        </div>

        @if (state() === 'error') {
          <p class="alert alert-error" role="alert">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn" [disabled]="state() === 'sending'">
          {{ state() === 'sending' ? 'Wird gesendet …' : 'Anmelden' }}
        </button>
      </form>
    }
  `,
  styles: `
    .hp {
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
    .consent-text {
      font-weight: 400;
      font-size: 0.95rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterForm {
  private readonly supabase = inject(SupabaseService);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    consent: [false, Validators.requiredTrue],
    website: [''],
  });
  protected readonly state = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  protected readonly errorMessage = signal('');
  private readonly submitted = signal(false);

  protected showError(name: 'email' | 'consent'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.state.set('sending');
    try {
      const { email, consent, website } = this.form.getRawValue();
      await this.supabase.invokeFunction('newsletter-subscribe', { email, consent, website });
      this.state.set('success');
    } catch {
      this.errorMessage.set('Die Anmeldung hat leider nicht geklappt. Bitte versuchen Sie es später erneut.');
      this.state.set('error');
    }
  }
}
