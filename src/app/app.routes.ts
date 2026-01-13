import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent, canActivate: [publicGuard] },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./components/auth-callback/auth-callback').then((m) => m.AuthCallback),
  },
  {
    path: 'plants',
    title: 'Plants',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/plants/plants').then((m) => m.Plants),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/plants/plants').then((m) => m.Plants),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
