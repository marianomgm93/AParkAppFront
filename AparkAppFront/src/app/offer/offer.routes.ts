import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';
const offerRoutes: Routes = [
  {
    path: ROUTE_SEGMENTS.offerList,
    loadComponent: () => import('./features/offer-list/offer-list'),
  },
  {
    path: ROUTE_SEGMENTS.offerCreate,
    loadComponent: () => import('./features/offer-form/offer-form'),
  },
];
export default offerRoutes;
