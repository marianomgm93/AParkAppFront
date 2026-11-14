import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_SEGMENTS.login,
  },
  {
    path: ROUTE_SEGMENTS.login,
    loadComponent: () => import('./features/login-form/login-form')
  },
  {
    path: ROUTE_SEGMENTS.signup,
    loadComponent: () => import('./features/register-form/register-form')
  },
];

export default authRoutes;