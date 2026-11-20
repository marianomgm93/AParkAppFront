import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const vehicleRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vehicle-list',
  },
  {
    path: ROUTE_SEGMENTS.vehicles,
    loadComponent: () => import('./features/vehicle-list/vehicle-list'),
  },
  {
    path: ROUTE_SEGMENTS.vehicleCreate,
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.vehicleEdit}/:id`,
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.vehicleDetail}/:id`,
    loadComponent: () => import('./features/vehicle-details/vehicle-details'),
  },
];

export default vehicleRoutes;
