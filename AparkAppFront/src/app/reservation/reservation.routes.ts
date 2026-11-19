import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';

const reservationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/reservation-list/reservation-list'),
  },
  {
    path: ':id',
    loadComponent: () => import('./feature/reservation-detail/reservation-detail'),
  },
];
export default reservationRoutes;
