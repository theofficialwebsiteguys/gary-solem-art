import { Routes } from '@angular/router';
import { META } from './content/page-copy';
import type { PageData } from './core/page-title.strategy';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Gary Solem Art',
    component: HomePage,
    data: { description: META.home } satisfies PageData,
  },
  {
    path: 'my-art',
    title: 'My Art',
    loadComponent: () => import('./pages/my-art/my-art.page').then((m) => m.MyArtPage),
    data: { description: META.myArt } satisfies PageData,
  },
  {
    path: 'direct-photography',
    title: 'Direct Photography',
    loadComponent: () =>
      import('./pages/direct-photography/direct-photography.page').then((m) => m.DirectPhotographyPage),
    data: { description: META.direct } satisfies PageData,
  },
  {
    path: 'wave-photography',
    title: 'Wave Photography',
    loadComponent: () => import('./pages/wave-photography/wave-photography.page').then((m) => m.WavePhotographyPage),
    data: { description: META.wave } satisfies PageData,
  },
  {
    path: 'contact-me',
    title: 'Contact Me',
    loadComponent: () => import('./pages/contact/contact.page').then((m) => m.ContactPage),
    data: { description: META.contact } satisfies PageData,
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
    data: { description: META.notFound, noindex: true } satisfies PageData,
  },
];
