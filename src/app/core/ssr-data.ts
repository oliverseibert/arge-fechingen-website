import { Injectable, PendingTasks, TransferState, inject, makeStateKey } from '@angular/core';

/** Lädt Daten einmal (SSR/Prerender) und übergibt sie per TransferState an den Browser. */
@Injectable({ providedIn: 'root' })
export class SsrData {
  private readonly transferState = inject(TransferState);
  private readonly pendingTasks = inject(PendingTasks);

  load<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const stateKey = makeStateKey<T>(key);
    if (this.transferState.hasKey(stateKey)) {
      const value = this.transferState.get(stateKey, null as T);
      this.transferState.remove(stateKey);
      return Promise.resolve(value);
    }
    // PendingTasks: Rendern wartet (zoneless) auf das Ergebnis
    return this.track(async () => {
      const value = await loader();
      this.transferState.set(stateKey, value);
      return value;
    });
  }

  private async track<T>(fn: () => Promise<T>): Promise<T> {
    const done = this.pendingTasks.add();
    try {
      return await fn();
    } finally {
      done();
    }
  }
}
