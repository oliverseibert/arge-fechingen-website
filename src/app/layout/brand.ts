import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Wortmarke: Wappen + „ARGE Fechingen“, verlinkt zur Startseite. */
@Component({
  selector: 'app-brand',
  imports: [RouterLink],
  template: `
    <a
      routerLink="/"
      class="brand"
      [class.inverse]="inverse()"
      aria-label="ARGE Fechingen – zur Startseite"
    >
      <img src="/assets/logo/wappen-fechingen-klein.png" alt="" width="36" height="41" />
      <span class="name" aria-hidden="true">
        <span class="word"><strong>ARGE</strong> <em>Fechingen</em></span>
        <small
          ><span class="long">Arbeitsgemeinschaft </span>Fechinger Ortsvereine e.&nbsp;V.</small
        >
      </span>
    </a>
  `,
  styles: `
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      text-decoration: none;
      color: var(--color-navy);
      flex-shrink: 0;
    }
    img {
      display: block;
      width: 2.25rem;
      height: auto;
      filter: drop-shadow(0 1px 2px rgb(11 36 71 / 15%));
    }
    .name {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .word {
      font-size: 1.2rem;
      letter-spacing: -0.01em;
    }
    strong {
      font-weight: 800;
    }
    em {
      margin-left: 0.2em;
      font-family: var(--font-serif);
      font-weight: 500;
      color: var(--color-primary);
    }
    small {
      font-size: 0.7rem;
      color: var(--color-text-muted);
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    // Auf schmalen Displays nur „Fechinger Ortsvereine e. V.“
    .long {
      display: none;
      @media (min-width: 30rem) {
        display: inline;
      }
    }
    .inverse {
      color: #fff;
      em {
        color: #9cc7f2;
      }
      small {
        color: rgb(255 255 255 / 65%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Brand {
  readonly inverse = input(false);
}
