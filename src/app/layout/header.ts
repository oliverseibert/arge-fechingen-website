import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Icon } from '../shared/icon';
import { Brand } from './brand';

export const MAIN_NAV = [
  { path: '/neues', label: 'Neues' },
  { path: '/die-arge', label: 'Die ARGE' },
  { path: '/vorstand', label: 'Der Vorstand' },
  { path: '/fechingen', label: 'Fechingen' },
  { path: '/vereine', label: 'Vereine' },
  { path: '/jubilaeum-2027', label: 'Jubiläum 2027' },
  { path: '/kontakt', label: 'Kontakt' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, Brand],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Header {
  protected readonly nav = MAIN_NAV;
  protected readonly open = signal(false);

  constructor() {
    // Menü nach Navigation schließen
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));

    // Seite hinter dem offenen Menü nicht scrollen
    const body = inject(DOCUMENT).body;
    effect(() => body.classList.toggle('nav-open', this.open()));
  }
}
