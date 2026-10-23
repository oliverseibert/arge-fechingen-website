import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'neues',
    loadComponent: () => import('./features/news/news-list').then((m) => m.NewsList),
  },
  {
    path: 'neues/:slug',
    loadComponent: () => import('./features/news/news-detail').then((m) => m.NewsDetail),
  },
  { path: 'die-arge', loadComponent: () => import('./features/arge/arge').then((m) => m.Arge) },
  {
    path: 'vorstand',
    loadComponent: () => import('./features/vorstand/vorstand').then((m) => m.Vorstand),
  },
  {
    path: 'fechingen',
    loadComponent: () => import('./features/fechingen/fechingen').then((m) => m.Fechingen),
  },
  {
    path: 'vereine',
    loadComponent: () => import('./features/vereine/vereine').then((m) => m.Vereine),
  },
  {
    path: 'jubilaeum-2027',
    loadComponent: () => import('./features/jubilaeum/jubilaeum').then((m) => m.Jubilaeum),
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./features/kontakt/kontakt').then((m) => m.Kontakt),
  },
  {
    path: 'impressum',
    loadComponent: () => import('./features/legal/impressum').then((m) => m.Impressum),
  },
  {
    path: 'datenschutz',
    loadComponent: () => import('./features/legal/datenschutz').then((m) => m.Datenschutz),
  },
  {
    path: 'newsletter/bestaetigen',
    loadComponent: () =>
      import('./features/newsletter/newsletter-confirm').then((m) => m.NewsletterConfirm),
  },
  {
    path: 'newsletter/abmelden',
    loadComponent: () =>
      import('./features/newsletter/newsletter-unsubscribe').then((m) => m.NewsletterUnsubscribe),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
