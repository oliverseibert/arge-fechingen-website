import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { News, NewsService } from '../../../data/news.service';
import { SupabaseService } from '../../../core/supabase.service';
import { MarkdownPipe } from '../../../shared/markdown.pipe';
import { fromDateTimeLocal, slugify, toDateTimeLocal } from '../../../shared/format';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-news-edit',
  imports: [ReactiveFormsModule, RouterLink, MarkdownPipe],
  templateUrl: './news-edit.html',
  styleUrl: './news-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsEdit {
  private readonly newsService = inject(NewsService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  /** Aus der Route; leer = neuer Beitrag */
  readonly id = input<string>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)]],
    teaser: [''],
    content: [''],
    image_alt: [''],
    status: ['draft' as News['status']],
    published_at: [''],
  });

  protected readonly existing = signal<News | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly preview = signal(false);
  private readonly content = toSignal(this.form.controls.content.valueChanges, {
    initialValue: '',
  });
  protected readonly previewContent = computed(() => (this.preview() ? this.content() : ''));

  // Bild: neue Datei, Entfernen-Flag, Vorschau-URL
  protected readonly imageFile = signal<File | null>(null);
  protected readonly removeImage = signal(false);
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly currentImageUrl = computed(() =>
    this.removeImage() ? null : this.supabase.publicImageUrl(this.existing()?.image_path),
  );

  private slugTouched = false;

  constructor() {
    this.form.controls.title.valueChanges.subscribe((title) => {
      if (!this.slugTouched && !this.existing()) this.form.controls.slug.setValue(slugify(title));
    });
    inject(DestroyRef).onDestroy(() => this.revokePreview());
    afterNextRender(() => this.load());
  }

  protected onSlugInput(): void {
    this.slugTouched = true;
  }

  protected onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.error.set('');
    if (file && !file.type.startsWith('image/')) {
      this.error.set('Bitte eine Bilddatei auswählen.');
      return;
    }
    if (file && file.size > MAX_IMAGE_BYTES) {
      this.error.set('Das Bild ist zu groß (maximal 5 MB).');
      return;
    }
    this.revokePreview();
    this.imageFile.set(file);
    this.imagePreview.set(file ? URL.createObjectURL(file) : null);
    if (file) this.removeImage.set(false);
  }

  protected clearImage(input: HTMLInputElement): void {
    input.value = '';
    this.revokePreview();
    this.imageFile.set(null);
    this.imagePreview.set(null);
    this.removeImage.set(true);
  }

  protected async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');

    const existing = this.existing();
    let uploadedPath: string | null = null;
    try {
      const value = this.form.getRawValue();
      let imagePath = existing?.image_path ?? null;
      if (this.imageFile()) {
        uploadedPath = await this.newsService.uploadImage(this.imageFile()!);
        imagePath = uploadedPath;
      } else if (this.removeImage()) {
        imagePath = null;
      }

      const data = {
        title: value.title.trim(),
        slug: value.slug,
        teaser: value.teaser.trim() || null,
        content: value.content,
        image_path: imagePath,
        image_alt: imagePath ? value.image_alt.trim() || null : null,
        status: value.status,
        published_at: fromDateTimeLocal(value.published_at),
      };
      const saved = existing
        ? await this.newsService.update(existing.id, data)
        : await this.newsService.create(data);

      // Altes Bild erst nach erfolgreichem Speichern entfernen
      if (existing?.image_path && existing.image_path !== saved.image_path) {
        await this.newsService.removeImage(existing.image_path);
      }
      await this.router.navigateByUrl('/admin/news');
    } catch (e) {
      if (uploadedPath) await this.newsService.removeImage(uploadedPath);
      const code = (e as { code?: string }).code;
      this.error.set(
        code === '23505'
          ? 'Dieser Slug ist bereits vergeben. Bitte einen anderen wählen.'
          : 'Der Beitrag konnte nicht gespeichert werden.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  private async load(): Promise<void> {
    const id = this.id();
    if (!id) return;
    this.loading.set(true);
    try {
      const news = await this.newsService.getById(id);
      if (!news) {
        this.error.set('Beitrag nicht gefunden.');
        return;
      }
      this.existing.set(news);
      this.form.setValue({
        title: news.title,
        slug: news.slug,
        teaser: news.teaser ?? '',
        content: news.content,
        image_alt: news.image_alt ?? '',
        status: news.status,
        published_at: toDateTimeLocal(news.published_at),
      });
    } catch {
      this.error.set('Beitrag konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  private revokePreview(): void {
    const url = this.imagePreview();
    if (url) URL.revokeObjectURL(url);
  }
}
