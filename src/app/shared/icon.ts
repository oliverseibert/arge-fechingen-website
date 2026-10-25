import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// SVG-Pfade nach Lucide (ISC-Lizenz), 24×24, Kontur
const ICONS = {
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-up-right': ['M7 7h10v10', 'M7 17 17 7'],
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ],
  'chevron-right': ['m9 18 6-6-6-6'],
  clock: ['M12 6v6l4 2', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z'],
  landmark: ['M3 22h18', 'M6 18v-7', 'M10 18v-7', 'M14 18v-7', 'M18 18v-7', 'M12 2 20 7H4z'],
  mail: [
    'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ],
  'map-pin': [
    'M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0',
    'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  ],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  newspaper: [
    'M15 18h-5',
    'M18 14h-8',
    'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2',
    'M10 6h8v4h-8z',
  ],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  ],
  sparkles: [
    'M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.4l-1.9-5.8L4 10.7l6.1-1.9z',
    'M19 3v4',
    'M21 5h-4',
  ],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  globe: [
    'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
    'M2 12h20',
    'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  ],
  x: ['M18 6 6 18', 'm6 6 12 12'],
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 1.25em;
      height: 1.25em;
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => ICONS[this.name()]);
}
