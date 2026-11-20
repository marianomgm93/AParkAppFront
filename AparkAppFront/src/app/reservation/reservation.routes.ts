import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';
import { authGuard, roleGuard } from '../auth/auth-guard-guard';

const reservationRoutes: Routes = [
  {
    path: ROUTE_SEGMENTS.reservationList,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_CLIENT', 'ROLE_EMPLOYEE'] },
    loadComponent: () => import('./feature/reservation-list/reservation-list'),
  },
  {
    path: `${ROUTE_SEGMENTS.reservationDetail}/:id`,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_CLIENT', 'ROLE_EMPLOYEE'] },
    loadComponent: () => import('./feature/reservation-detail/reservation-detail'),
  },
];
export default reservationRoutes;
