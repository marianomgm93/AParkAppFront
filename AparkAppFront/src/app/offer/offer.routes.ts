import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';
import { authGuard } from '../auth/guards/auth-guard';
import { roleGuard } from '../auth/guards/role-guard-guard';
const offerRoutes: Routes = [
  {
    path: ROUTE_SEGMENTS.offerList,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_EMPLOYEE', 'ROLE_CLIENT'] },
    loadComponent: () => import('./features/offer-list/offer-list'),
  },
  {
    path: ROUTE_SEGMENTS.offerCreate,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_EMPLOYEE'] },
    loadComponent: () => import('./features/offer-form/offer-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.offerDetail}/:id`,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_EMPLOYEE', 'ROLE_CLIENT'] },
    loadComponent: () => import('./features/offer-detail/offer-detail'),
  },
];
export default offerRoutes;
