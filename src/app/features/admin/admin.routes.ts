import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from '../../core/guards';

export const adminRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login').then((m) => m.Login),
  },
  {
    path: 'passwort-vergessen',
    loadComponent: () => import('./auth/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'passwort-setzen',
    loadComponent: () => import('./auth/set-password').then((m) => m.SetPassword),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', loadComponent: () => import('./dashboard').then((m) => m.Dashboard) },
      {
        path: 'news',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./news/news-admin-list').then((m) => m.NewsAdminList),
      },
      {
        path: 'news/neu',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./news/news-edit').then((m) => m.NewsEdit),
      },
      {
        path: 'news/:id',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./news/news-edit').then((m) => m.NewsEdit),
      },
      {
        path: 'termine',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./events/events-admin-list').then((m) => m.EventsAdminList),
      },
      {
        path: 'termine/neu',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./events/event-edit').then((m) => m.EventEdit),
      },
      {
        path: 'termine/:id',
        canActivate: [roleGuard('content_creator')],
        loadComponent: () => import('./events/event-edit').then((m) => m.EventEdit),
      },
      {
        path: 'newsletter',
        canActivate: [roleGuard('admin')],
        loadComponent: () => import('./newsletter/subscribers').then((m) => m.Subscribers),
      },
      {
        path: 'benutzer',
        canActivate: [roleGuard('admin')],
        loadComponent: () => import('./users/users').then((m) => m.Users),
      },
    ],
  },
];
