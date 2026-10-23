import { Injectable, inject } from '@angular/core';
import { NEWS_IMAGES_BUCKET, SupabaseService } from '../core/supabase.service';
import { SsrData } from '../core/ssr-data';
import { Tables, TablesInsert, TablesUpdate } from '../core/database.types';

export type News = Tables<'news'>;
export type NewsSummary = Pick<
  News,
  'id' | 'title' | 'slug' | 'teaser' | 'image_path' | 'image_alt' | 'published_at'
>;

const SUMMARY_COLUMNS = 'id, title, slug, teaser, image_path, image_alt, published_at';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly supabase = inject(SupabaseService);
  private readonly ssrData = inject(SsrData);

  /** Veröffentlichte News, neueste zuerst (RLS liefert öffentlich nur veröffentlichte). */
  listPublished(): Promise<NewsSummary[]> {
    return this.ssrData.load('news:list', async () => {
      const client = this.supabase.client;
      if (!client) return [];
      const { data, error } = await client
        .from('news')
        .select(SUMMARY_COLUMNS)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    });
  }

  getPublishedBySlug(slug: string): Promise<News | null> {
    return this.ssrData.load(`news:${slug}`, async () => {
      const client = this.supabase.client;
      if (!client) return null;
      const { data, error } = await client
        .from('news')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data;
    });
  }

  // --- Admin ---

  async listAll(): Promise<News[]> {
    const { data, error } = await this.supabase.required
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<News | null> {
    const { data, error } = await this.supabase.required
      .from('news')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(news: TablesInsert<'news'>): Promise<News> {
    const { data, error } = await this.supabase.required
      .from('news')
      .insert(news)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, changes: TablesUpdate<'news'>): Promise<News> {
    const { data, error } = await this.supabase.required
      .from('news')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(news: News): Promise<void> {
    const { error } = await this.supabase.required.from('news').delete().eq('id', news.id);
    if (error) throw error;
    if (news.image_path) await this.removeImage(news.image_path);
  }

  async uploadImage(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const { error } = await this.supabase.required.storage
      .from(NEWS_IMAGES_BUCKET)
      .upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
  }

  async removeImage(path: string): Promise<void> {
    const { error } = await this.supabase.required.storage.from(NEWS_IMAGES_BUCKET).remove([path]);
    if (error) console.warn('Bild konnte nicht gelöscht werden', error);
  }
}
