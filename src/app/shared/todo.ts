import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Sichtbarer Platzhalter für Inhalte, die noch fehlen. */
@Component({
  selector: 'app-todo',
  template: `<strong class="label">TODO:</strong><ng-content />`,
  styles: `
    :host {
      display: block;
      padding: var(--space-3);
      margin-block: var(--space-3);
      border: 2px dashed var(--color-todo-border);
      border-radius: var(--radius);
      background: var(--color-todo-bg);
      color: #3d3100;
    }
    .label {
      margin-right: 0.35em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'note' },
})
export class Todo {}
