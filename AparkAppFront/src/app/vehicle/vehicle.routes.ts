import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const vehicleRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vehicle-list',
  },
  {
    path: 'vehicle-list',
    loadComponent: () => import('./features/vehicle-list/vehicle-list'),
  },
  {
    path: 'vehicle-form',
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: 'vehicle-form/:id',
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: 'vehicle-detail/:id',
    loadComponent: () => import('./features/vehicle-details/vehicle-details'),
  },
  {
    path: ROUTE_SEGMENTS.vehicles,
    loadComponent: () => import('./features/vehicle-list/vehicle-list'),
  },
  {
    path: ROUTE_SEGMENTS.vehicleNew,
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: `:id/${ROUTE_SEGMENTS.vehicleEdit}`,
    loadComponent: () => import('./features/vehicle-form/vehicle-form'),
  },
  {
    path: `:id/${ROUTE_SEGMENTS.vehicleDetail}`,
    loadComponent: () => import('./features/vehicle-details/vehicle-details'),
  },
];

export default vehicleRoutes;
