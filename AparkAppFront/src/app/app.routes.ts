import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from './app.route.segments';
import { authGuard, guestGuard, roleGuard } from './auth/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_SEGMENTS.home,
  },
  {
    path: ROUTE_SEGMENTS.home,
    loadComponent: () => import('./home/home'),
  },
  {
    path: ROUTE_SEGMENTS.offer,
    canActivate: [authGuard],
    loadComponent: () => import('./offer/ui/offer-layout/offer-layout'),
    loadChildren: () => import('./offer/offer.routes'),
  },
  {
    path: ROUTE_SEGMENTS.reservation,
    canActivate: [authGuard],
    loadComponent: () => import('./reservation/ui/reservation-layout/reservation-layout'),
    loadChildren: () => import('./reservation/reservation.routes'),
  },
  {
    path: ROUTE_SEGMENTS.auth,
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/ui/auth-layout/auth-layout'),
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: ROUTE_SEGMENTS.users,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./user/ui/user-layout/user-layout'),
    loadChildren: () => import('./user/user.routes'),
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: ROUTE_SEGMENTS.parkingLot,
    canActivate: [authGuard],
    loadComponent: () => import('./parking-lot/ui/parking-lot-layout/parking-lot-layout'),
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
