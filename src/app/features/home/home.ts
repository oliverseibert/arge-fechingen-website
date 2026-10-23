import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-home',
  template: `
    <section class="hero container">
      <h1 class="visually-hidden">ARGE Fechingen</h1>
      <img
        src="/assets/logo/arge-fechingen-logo.webp"
        alt="Logo der ARGE Fechingen: Fechinger Wappen mit Krone, Schriftzug „ARGE Fechingen“, Kirche mit Turm und blaue Welle"
        width="1201"
        height="780"
        fetchpriority="high"
      />
    </section>
  `,
  styles: `
    .hero {
      display: flex;
      justify-content: center;
      padding-block: var(--space-5) var(--space-6);
    }
    img {
      width: min(100%, 56rem);
      height: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  constructor() {
    inject(SeoService).set({ path: '/', description: 'Die ARGE (Arbeitsgemeinschaft) Fechingen – Neuigkeiten, Termine und Informationen rund um Fechingen.' });
  }
}
