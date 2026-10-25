import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Sichtbarer Platzhalter für Inhalte, die noch fehlen. */
@Component({
  selector: 'app-todo',
  template: `<strong class="label">TODO:</strong><ng-content />`,
  styles: `
    :host {
      display: block;
      padding: var(--space-3) var(--space-4);
      margin-block: var(--space-3);
      border: 1px dashed var(--color-todo-border);
      border-radius: var(--radius);
      background: var(--color-todo-bg);
      color: #4a3c00;
      font-size: 0.95rem;
    }
    .label {
      margin-right: 0.35em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'note' },
})
export class Todo {}
