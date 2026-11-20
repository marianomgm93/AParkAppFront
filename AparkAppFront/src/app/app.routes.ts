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
    path: ROUTE_SEGMENTS.reservations,
    loadComponent: () => import('./reservation/ui/reservation-layout/reservation-layout'),
    loadChildren: () => import('./reservation/reservation.routes'),
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
    path: 'parking-spot',
    loadChildren: () => import('./spot/parking-spots.routes'),
  },
  {
    path: ROUTE_SEGMENTS.vehicle,
    loadComponent: () => import('./vehicle/ui/vehicle-layout/vehicle-layout'),
    loadChildren: () => import('./vehicle/vehicle.routes'),  },
  {
    path: ROUTE_SEGMENTS.tickets,
    loadComponent: () => import('./ticket/ui/ticket-layout/ticket-layout'),
    loadChildren: () => import('./ticket/ticket.routes'),
  },

  { path: '**', redirectTo: '/' },
];
