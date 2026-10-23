import { ChangeDetectionStrategy, Component, afterNextRender, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-newsletter-confirm',
  imports: [RouterLink],
  template: `
    <article class="page container prose">
      <h1>Newsletter-Anmeldung</h1>
      @switch (state()) {
        @case ('loading') {
          <p aria-live="polite">Ihre Anmeldung wird bestätigt …</p>
        }
        @case ('success') {
          <p class="alert alert-success" role="status">Vielen Dank! Ihre Anmeldung zum Newsletter ist bestätigt.</p>
        }
        @case ('error') {
          <p class="alert alert-error" role="alert">
            Der Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.
          </p>
        }
      }
      <p><a routerLink="/neues">Zu den Neuigkeiten</a></p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterConfirm {
  private readonly supabase = inject(SupabaseService);
  readonly token = input<string>();
  protected readonly state = signal<'loading' | 'success' | 'error'>('loading');

  constructor() {
    inject(SeoService).set({ title: 'Newsletter bestätigen', noindex: true });
    // Nur im Browser bestätigen, nicht beim Server-Rendering
    afterNextRender(() => this.confirm());
  }

  private async confirm(): Promise<void> {
    const token = this.token();
    if (!token) return this.state.set('error');
    try {
      await this.supabase.invokeFunction('newsletter-confirm', { token });
      this.state.set('success');
    } catch {
      this.state.set('error');
    }
  }
}
