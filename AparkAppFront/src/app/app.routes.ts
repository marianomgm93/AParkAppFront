import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from './app.route.segments';

export const routes: Routes = [
  {
    path: ROUTE_SEGMENTS.home,
    pathMatch: 'full',
    loadComponent: () => import('./home/home'),
  },
  {
    path: ROUTE_SEGMENTS.offers,
    loadComponent: () => import('./offer/ui/offer-layout/offer-layout'),
    loadChildren: () => import('./offer/offer.routes'),
  },
  {
    path: ROUTE_SEGMENTS.auth,
    loadComponent: () => import('./auth/ui/auth-layout/auth-layout'),
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: ROUTE_SEGMENTS.users,
    loadComponent: () => import('./user/ui/user-layout/user-layout'),
    loadChildren: () => import('./user/user.routes'),
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'parking-lot',
    loadChildren: () => import('./parking-lot/parking-lot.routes'),
  },
  {
    path: ROUTE_SEGMENTS.tickets,
    loadComponent: () => import('./ticket/ui/ticket-layout/ticket-layout'),
    loadChildren: () => import('./ticket/ticket.routes'),
  },

  { path: '**', redirectTo: '/' },
];
