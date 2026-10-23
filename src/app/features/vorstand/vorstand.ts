import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Todo } from '../../shared/todo';
import { GRUPPENBILD, VORSTAND } from './vorstand.data';

@Component({
  selector: 'app-vorstand',
  imports: [Todo],
  templateUrl: './vorstand.html',
  styleUrl: './vorstand.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vorstand {
  protected readonly mitglieder = VORSTAND;
  protected readonly gruppenbild = GRUPPENBILD;

  constructor() {
    inject(SeoService).set({ title: 'Der Vorstand', path: '/vorstand', description: 'Der Vorstand der ARGE Fechingen stellt sich vor.' });
  }
}
