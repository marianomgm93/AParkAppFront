import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const parkingSpotRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'parking-spot-list',
  },
  {
    path: 'parking-spot-list',
    loadComponent: () => import('./features/spot-catalog/spot-catalog'),
  },
  {
    path: 'parking-spot-form',
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: 'parking-spot-form/:id',
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: 'parking-spot-detail/:id',
    loadComponent: () => import('./features/spot-details/spot-details'),
  },
  {
    path: ROUTE_SEGMENTS.spots,
    loadComponent: () => import('./features/spot-catalog/spot-catalog'),
  },
  {
    path: ROUTE_SEGMENTS.spotNew,
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: `:id/${ROUTE_SEGMENTS.spotEdit}`,
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: `:id/${ROUTE_SEGMENTS.spotDetail}`,
    loadComponent: () => import('./features/spot-details/spot-details'),
  },
];

export default parkingSpotRoutes;
