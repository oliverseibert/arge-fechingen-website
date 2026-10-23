import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { SeoService } from '../../../core/seo.service';

const MIN_LENGTH = 10;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('repeat')?.value ? null : { mismatch: true };
}

/** Ziel für Einladungs- und Passwort-Reset-Links. */
@Component({
  selector: 'app-set-password',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card auth">
        <h1>Passwort setzen</h1>
        @switch (state()) {
          @case ('loading') {
            <p aria-live="polite">Link wird geprüft …</p>
          }
          @case ('invalid') {
            <p class="alert alert-error" role="alert">
              Der Link ist ungültig oder abgelaufen. Fordern Sie einen neuen Link an.
            </p>
            <p class="links"><a routerLink="/admin/passwort-vergessen">Neuen Link anfordern</a></p>
          }
          @default {
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="form-field">
                <label for="sp-password">Neues Passwort</label>
                <input
                  id="sp-password"
                  type="password"
                  formControlName="password"
                  autocomplete="new-password"
                  required
                  aria-describedby="sp-hint"
                />
                <span id="sp-hint" class="hint">Mindestens {{ minLength }} Zeichen.</span>
              </div>
              <div class="form-field">
                <label for="sp-repeat">Passwort wiederholen</label>
                <input
                  id="sp-repeat"
                  type="password"
                  formControlName="repeat"
                  autocomplete="new-password"
                  required
                />
                @if (form.errors?.['mismatch'] && form.controls.repeat.touched) {
                  <span class="error">Die Passwörter stimmen nicht überein.</span>
                }
              </div>
              @if (error()) {
                <p class="alert alert-error" role="alert">{{ error() }}</p>
              }
              <button type="submit" class="btn" [disabled]="form.invalid || state() === 'saving'">
                Passwort speichern
              </button>
            </form>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './auth-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPassword {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly minLength = MIN_LENGTH;

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(MIN_LENGTH)]],
      repeat: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );
  protected readonly state = signal<'loading' | 'invalid' | 'ready' | 'saving'>('loading');
  protected readonly error = signal('');

  constructor() {
    inject(SeoService).set({ title: 'Passwort setzen', noindex: true });
    afterNextRender(async () => {
      const hashError = new URLSearchParams(location.hash.slice(1)).get('error');
      await this.auth.init();
      this.state.set(!hashError && this.auth.isLoggedIn() ? 'ready' : 'invalid');
    });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.state.set('saving');
    this.error.set('');
    try {
      await this.auth.updatePassword(this.form.getRawValue().password);
      await this.auth.loadProfile();
      await this.router.navigateByUrl('/admin');
    } catch {
      this.error.set(
        'Das Passwort konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
      );
      this.state.set('ready');
    }
  }
}
