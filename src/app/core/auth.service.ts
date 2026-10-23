import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Enums, Tables } from './database.types';

export type AppRole = Enums<'app_role'>;
export type Profile = Tables<'profiles'>;

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Admin',
  content_creator: 'Redaktion',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly session = signal<Session | null>(null);
  readonly profile = signal<Profile | null>(null);
  /** true nach Rückkehr über Passwort-Reset-Link */
  readonly passwordRecovery = signal(false);

  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly role = computed(() => (this.profile()?.active ? this.profile()!.role : null));
  readonly isAdmin = computed(() => this.role() === 'admin');

  private initialized: Promise<void> | null = null;

  /** Session und Profil laden (einmalig, nur im Browser). */
  init(): Promise<void> {
    if (!this.isBrowser || !this.supabase.client) return Promise.resolve();
    this.initialized ??= this.doInit();
    return this.initialized;
  }

  /** admin darf alles, content_creator nur Inhalte. */
  hasRole(required: AppRole): boolean {
    const role = this.role();
    return role === 'admin' || (role !== null && role === required);
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.required.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await this.loadProfile();
  }

  async signOut(): Promise<void> {
    await this.supabase.required.auth.signOut();
    this.profile.set(null);
  }

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await this.supabase.required.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/admin/passwort-setzen`,
    });
    if (error) throw error;
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.required.auth.updateUser({ password });
    if (error) throw error;
    this.passwordRecovery.set(false);
  }

  private async doInit(): Promise<void> {
    const client = this.supabase.required;
    client.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      if (event === 'PASSWORD_RECOVERY') this.passwordRecovery.set(true);
      if (event === 'SIGNED_OUT') this.profile.set(null);
    });
    const { data } = await client.auth.getSession();
    this.session.set(data.session);
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    const client = this.supabase.required;
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) {
      this.profile.set(null);
      return;
    }
    this.session.set((await client.auth.getSession()).data.session);
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle();
    if (error) console.error('Profil konnte nicht geladen werden', error);
    this.profile.set(data ?? null);
  }
}
