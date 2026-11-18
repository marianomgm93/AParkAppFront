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
  {
    path: 'address',
    loadChildren: () => import('./address/address.routes')
  },
  {
    path: 'parking-lot',
    loadChildren: () => import('./parking-lot/parking-lot.routes')
  },
  {
    path: ROUTE_SEGMENTS.vehicles,
    loadComponent: () => import('./vehicle/ui/vehicle-layout/vehicle-layout'),
    loadChildren: () => import('./vehicle/vehicle.routes')
  },
  { path: '**', redirectTo: '/' },
];
