import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from './app.route.segments';

export const routes: Routes = [
  {
    path: ROUTE_SEGMENTS.auth,
    loadComponent: () => import('./auth/ui/auth-layout/auth-layout'),
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: ROUTE_SEGMENTS.users,
    loadComponent: () => import('./user/ui/user-layout/user-layout'),
    loadChildren: () => import('./user/user.routes')
  },
  { path: '', pathMatch: 'full', redirectTo: ROUTE_SEGMENTS.auth },
  { path: '**', redirectTo: '/' },
];
