import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppRole, AuthService, Profile, ROLE_LABELS } from '../../../core/auth.service';
import { SupabaseService } from '../../../core/supabase.service';
import { formatDateTime } from '../../../shared/format';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styles: `
    .invite {
      margin-bottom: var(--space-5);
      h2 {
        margin-top: 0;
      }
    }
    .row {
      display: grid;
      gap: var(--space-3);
      @media (min-width: 48rem) {
        grid-template-columns: 2fr 2fr 1fr;
      }
    }
    td select {
      width: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private readonly supabase = inject(SupabaseService);
  protected readonly auth = inject(AuthService);
  protected readonly formatDateTime = formatDateTime;
  protected readonly roles = Object.entries(ROLE_LABELS) as [AppRole, string][];

  protected readonly users = resource({
    loader: async (): Promise<Profile[]> => {
      const { data, error } = await this.supabase.required.from('profiles').select('*').order('created_at');
      if (error) throw error;
      return data;
    },
  });

  protected readonly inviteForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    name: [''],
    role: ['content_creator' as AppRole],
  });
  protected readonly inviting = signal(false);
  protected readonly busyId = signal<string | null>(null);
  protected readonly message = signal<{ text: string; error?: boolean } | null>(null);

  protected roleLabel(role: AppRole): string {
    return ROLE_LABELS[role];
  }

  protected isSelf(user: Profile): boolean {
    return user.id === this.auth.profile()?.id;
  }

  protected async invite(): Promise<void> {
    this.inviteForm.markAllAsTouched();
    if (this.inviteForm.invalid) return;
    this.inviting.set(true);
    this.message.set(null);
    try {
      const value = this.inviteForm.getRawValue();
      await this.supabase.invokeFunction('invite-user', value);
      this.message.set({ text: `Einladung an ${value.email} wurde verschickt.` });
      this.inviteForm.reset();
      this.users.reload();
    } catch (e) {
      this.message.set({ text: `Einladung fehlgeschlagen: ${(e as Error).message}`, error: true });
    } finally {
      this.inviting.set(false);
    }
  }

  protected async changeRole(user: Profile, role: AppRole): Promise<void> {
    if (role === user.role) return;
    await this.run(user, async () => {
      const { error } = await this.supabase.required.from('profiles').update({ role }).eq('id', user.id);
      if (error) throw error;
      return `Rolle von ${user.email} ist jetzt „${ROLE_LABELS[role]}“.`;
    });
  }

  protected async setActive(user: Profile, active: boolean): Promise<void> {
    if (!active && !confirm(`${user.email} wirklich deaktivieren? Der Zugang wird sofort gesperrt.`)) return;
    await this.run(user, async () => {
      await this.supabase.invokeFunction('manage-user', { userId: user.id, action: active ? 'activate' : 'deactivate' });
      return active ? `${user.email} ist wieder aktiv.` : `${user.email} wurde deaktiviert.`;
    });
  }

  private async run(user: Profile, action: () => Promise<string>): Promise<void> {
    this.busyId.set(user.id);
    this.message.set(null);
    try {
      this.message.set({ text: await action() });
    } catch (e) {
      this.message.set({ text: `Aktion fehlgeschlagen: ${(e as Error).message}`, error: true });
    } finally {
      this.busyId.set(null);
      this.users.reload();
    }
  }
}
