import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const addressRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'address-form',
  },
  {
    path: 'address-form',
    loadComponent: () => import('./features/address-form/address-form'),
  },
];

export default addressRoutes;
