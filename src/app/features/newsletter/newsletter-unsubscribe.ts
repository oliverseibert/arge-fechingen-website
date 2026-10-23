import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-newsletter-unsubscribe',
  imports: [RouterLink],
  template: `
    <article class="page container prose">
      <h1>Newsletter abbestellen</h1>
      @switch (state()) {
        @case ('success') {
          <p class="alert alert-success" role="status">Sie wurden vom Newsletter abgemeldet.</p>
        }
        @case ('error') {
          <p class="alert alert-error" role="alert">Der Abmeldelink ist ungültig. Bitte wenden Sie sich an uns.</p>
        }
        @default {
          @if (token()) {
            <p>Möchten Sie den Newsletter der ARGE Fechingen wirklich abbestellen?</p>
            <button type="button" class="btn" [disabled]="state() === 'sending'" (click)="unsubscribe()">
              {{ state() === 'sending' ? 'Wird abgemeldet …' : 'Jetzt abmelden' }}
            </button>
          } @else {
            <p class="alert alert-error" role="alert">Der Abmeldelink ist unvollständig.</p>
          }
        }
      }
      <p class="back"><a routerLink="/">Zur Startseite</a></p>
    </article>
  `,
  styles: `
    .back {
      margin-top: var(--space-4);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterUnsubscribe {
  private readonly supabase = inject(SupabaseService);
  readonly token = input<string>();
  protected readonly state = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  constructor() {
    inject(SeoService).set({ title: 'Newsletter abbestellen', noindex: true });
  }

  protected async unsubscribe(): Promise<void> {
    this.state.set('sending');
    try {
      await this.supabase.invokeFunction('newsletter-unsubscribe', { token: this.token() });
      this.state.set('success');
    } catch {
      this.state.set('error');
    }
  }
}
