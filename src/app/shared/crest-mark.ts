import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Wappen-Silhouette (geständert, ohne Krone) als dekoratives Wasserzeichen. */
@Component({
  selector: 'app-crest-mark',
  template: `
    <svg viewBox="0 0 100 112" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="crest-shield">
          <path d="M2 2h96v52c0 30-22 50-48 56C24 104 2 84 2 54z" />
        </clipPath>
      </defs>
      <g clip-path="url(#crest-shield)">
        <path d="M50 56 2 2h48z" />
        <path d="M50 56 98 2v54z" />
        <path d="M50 56 98 112H50z" />
        <path d="M50 56 2 112V56z" />
      </g>
      <path
        d="M2 2h96v52c0 30-22 50-48 56C24 104 2 84 2 54z"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      color: currentColor;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrestMark {}
