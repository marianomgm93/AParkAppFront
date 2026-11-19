import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const parkingSpotRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_SEGMENTS.spots,
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