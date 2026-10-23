import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole, AuthService } from './auth.service';

/** Angemeldet und mit aktiver Rolle – sonst zum Login. */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.init();
  if (auth.role()) return true;
  return router.createUrlTree(['/admin/login'], {
    queryParams: { redirect: state.url, ...(auth.isLoggedIn() ? { fehler: 'keine-rolle' } : {}) },
  });
};

/** Mindestens die angegebene Rolle (admin schließt content_creator ein). */
export function roleGuard(role: AppRole): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    await auth.init();
    return auth.hasRole(role) ? true : router.createUrlTree(['/admin']);
  };
}

/** Bereits angemeldete Nutzer vom Login direkt ins Admin-Dashboard. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  await auth.init();
  return auth.role() ? inject(Router).createUrlTree(['/admin']) : true;
};
