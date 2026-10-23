import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Database } from './database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

export const NEWS_IMAGES_BUCKET = 'news-images';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Null, wenn SUPABASE_URL/SUPABASE_ANON_KEY nicht gesetzt sind. */
  readonly client: TypedSupabaseClient | null = this.createClient();

  get configured(): boolean {
    return this.client !== null;
  }

  /** Client oder Fehler – für Bereiche, die Supabase zwingend brauchen (Admin). */
  get required(): TypedSupabaseClient {
    if (!this.client) {
      throw new Error('Supabase ist nicht konfiguriert (SUPABASE_URL / SUPABASE_ANON_KEY).');
    }
    return this.client;
  }

  publicImageUrl(path: string | null | undefined): string | null {
    if (!path || !this.client) return null;
    return this.client.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async invokeFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.required.functions.invoke<T>(name, { body });
    if (error) {
      // Fehlermeldung der Edge Function bevorzugen
      const context = (error as { context?: Response }).context;
      const message = context ? await context.json().then((j: { error?: string }) => j.error).catch(() => null) : null;
      throw new Error(message ?? error.message);
    }
    return data as T;
  }

  private createClient(): TypedSupabaseClient | null {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) return null;
    return createClient<Database>(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        // Sessions nur im Browser; auf dem Server wird nur öffentlich gelesen
        persistSession: this.isBrowser,
        autoRefreshToken: this.isBrowser,
        detectSessionInUrl: this.isBrowser,
      },
    });
  }
}
