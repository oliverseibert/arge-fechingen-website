import { ChangeDetectionStrategy, Component, afterNextRender, inject, input, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EVENT_CATEGORIES, EventCategory, EventItem, EventsService } from '../../../data/events.service';
import { fromDateTimeLocal, toDateTimeLocal } from '../../../shared/format';

function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('starts_at')?.value;
  const end = group.get('ends_at')?.value;
  return start && end && end < start ? { endBeforeStart: true } : null;
}

@Component({
  selector: 'app-event-edit',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <p><a routerLink="/admin/termine">← Zurück zur Übersicht</a></p>
    <h1>{{ existing() ? 'Termin bearbeiten' : 'Neuer Termin' }}</h1>

    @if (loading()) {
      <p aria-live="polite">Wird geladen …</p>
    } @else {
      <form [formGroup]="form" (ngSubmit)="save()" class="editor">
        <div class="form-field">
          <label for="ev-title">Titel</label>
          <input id="ev-title" type="text" formControlName="title" required />
          @if (form.controls.title.touched && form.controls.title.invalid) {
            <span class="error">Bitte einen Titel eingeben.</span>
          }
        </div>

        <div class="form-field">
          <label for="ev-description">Beschreibung</label>
          <textarea id="ev-description" formControlName="description" rows="5"></textarea>
        </div>

        <div class="row">
          <div class="form-field">
            <label for="ev-start">Beginn</label>
            <input id="ev-start" type="datetime-local" formControlName="starts_at" required />
            @if (form.controls.starts_at.touched && form.controls.starts_at.invalid) {
              <span class="error">Bitte Datum und Uhrzeit angeben.</span>
            }
          </div>
          <div class="form-field">
            <label for="ev-end">Ende (optional)</label>
            <input id="ev-end" type="datetime-local" formControlName="ends_at" />
            @if (form.errors?.['endBeforeStart']) {
              <span class="error">Das Ende muss nach dem Beginn liegen.</span>
            }
          </div>
        </div>

        <div class="row">
          <div class="form-field">
            <label for="ev-location">Ort</label>
            <input id="ev-location" type="text" formControlName="location" />
          </div>
          <div class="form-field">
            <label for="ev-category">Kategorie</label>
            <select id="ev-category" formControlName="category">
              @for (c of categories; track c.value) {
                <option [value]="c.value">{{ c.label }}</option>
              }
            </select>
          </div>
        </div>

        @if (error()) {
          <p class="alert alert-error" role="alert">{{ error() }}</p>
        }

        <div class="actions">
          <button type="submit" class="btn" [disabled]="saving()">{{ saving() ? 'Wird gespeichert …' : 'Speichern' }}</button>
          <a routerLink="/admin/termine" class="btn btn-secondary">Abbrechen</a>
        </div>
      </form>
    }
  `,
  styles: `
    .editor {
      max-width: 50rem;
    }
    .row {
      display: grid;
      gap: var(--space-3);
      @media (min-width: 40rem) {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEdit {
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);
  protected readonly categories = EVENT_CATEGORIES;

  readonly id = input<string>();

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      starts_at: ['', Validators.required],
      ends_at: [''],
      location: [''],
      category: ['jubilaeum_2027' as EventCategory],
    },
    { validators: endAfterStart },
  );

  protected readonly existing = signal<EventItem | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  constructor() {
    afterNextRender(() => this.load());
  }

  protected async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const v = this.form.getRawValue();
      const data = {
        title: v.title.trim(),
        description: v.description.trim() || null,
        starts_at: fromDateTimeLocal(v.starts_at)!,
        ends_at: fromDateTimeLocal(v.ends_at),
        location: v.location.trim() || null,
        category: v.category,
      };
      const existing = this.existing();
      if (existing) await this.eventsService.update(existing.id, data);
      else await this.eventsService.create(data);
      await this.router.navigateByUrl('/admin/termine');
    } catch {
      this.error.set('Der Termin konnte nicht gespeichert werden.');
    } finally {
      this.saving.set(false);
    }
  }

  private async load(): Promise<void> {
    const id = this.id();
    if (!id) return;
    this.loading.set(true);
    try {
      const event = await this.eventsService.getById(id);
      if (!event) {
        this.error.set('Termin nicht gefunden.');
        return;
      }
      this.existing.set(event);
      this.form.setValue({
        title: event.title,
        description: event.description ?? '',
        starts_at: toDateTimeLocal(event.starts_at),
        ends_at: toDateTimeLocal(event.ends_at),
        location: event.location ?? '',
        category: event.category,
      });
    } catch {
      this.error.set('Termin konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }
}
