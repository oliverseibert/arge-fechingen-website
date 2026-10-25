import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrestMark } from './crest-mark';
import { Icon } from './icon';

export interface Crumb {
  label: string;
  link?: string;
}

/** Einheitlicher Seitenkopf für Unterseiten. */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink, CrestMark, Icon],
  template: `
    <section class="page-header" aria-labelledby="page-title">
      <app-crest-mark class="watermark" />
      <div class="container inner">
        <nav aria-label="Brotkrumen">
          <ol class="crumbs">
            <li><a routerLink="/">Startseite</a></li>
            @for (crumb of crumbs(); track crumb.label) {
              <li>
                <app-icon name="chevron-right" />
                @if (crumb.link) {
                  <a [routerLink]="crumb.link">{{ crumb.label }}</a>
                } @else {
                  <span>{{ crumb.label }}</span>
                }
              </li>
            }
            <li aria-current="page">
              <app-icon name="chevron-right" />
              <span>{{ crumbLabel() ?? title() + (accent() ? ' ' + accent() : '') }}</span>
            </li>
          </ol>
        </nav>
        <div class="text fade-up">
          @if (eyebrow()) {
            <span class="eyebrow">{{ eyebrow() }}</span>
          }
          <h1 id="page-title">
            {{ title() }}
            @if (accent()) {
              <em class="accent">{{ accent() }}</em>
            }
          </h1>
          @if (intro()) {
            <p class="intro">{{ intro() }}</p>
          }
          <ng-content />
        </div>
      </div>
    </section>
  `,
  styles: `
    .page-header {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      background:
        radial-gradient(40rem 24rem at 100% 0%, var(--color-accent), transparent 70%),
        var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .watermark {
      position: absolute;
      z-index: -1;
      right: -3rem;
      bottom: -5rem;
      width: 18rem;
      height: 20rem;
      color: color-mix(in srgb, var(--color-primary) 7%, transparent);
      @media (min-width: 48rem) {
        right: 4rem;
        width: 24rem;
        height: 27rem;
      }
    }
    .inner {
      padding-block: var(--space-4) var(--space-5);
      @media (min-width: 48rem) {
        padding-block: var(--space-5) var(--space-6);
      }
    }
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-1);
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      li {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
      }
      a {
        color: var(--color-text-muted);
        text-decoration: none;
        &:hover {
          color: var(--color-primary-ink);
        }
      }
      app-icon {
        width: 0.9rem;
        height: 0.9rem;
        opacity: 0.6;
      }
      [aria-current] span {
        color: var(--color-text);
        font-weight: 500;
      }
    }
    .text {
      max-width: 48rem;
      margin-top: var(--space-5);
    }
    h1 {
      margin: 0;
    }
    .intro {
      margin: var(--space-3) 0 0;
      font-size: clamp(1.1rem, 1rem + 0.4vw, 1.25rem);
      line-height: 1.6;
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  /** Kursiv hervorgehobener Teil hinter dem Titel */
  readonly accent = input<string>();
  readonly eyebrow = input<string>();
  readonly intro = input<string>();
  readonly crumbs = input<Crumb[]>([]);
  /** Name in den Brotkrumen, falls abweichend vom Titel */
  readonly crumbLabel = input<string>();
}
