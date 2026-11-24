import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';
import { authGuard } from '../auth/guards/auth-guard';
import { roleGuard } from '../auth/guards/role-guard-guard';

const parkingLotRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'parking-lot-list',
  },
  {
    path: ROUTE_SEGMENTS.parkingLotForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./features/parking-lot-form/parking-lot-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.parkingLotForm}/:id`,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OWNER'] },
    loadComponent: () => import('./features/parking-lot-form/parking-lot-form'),
  },
  {
    path: ROUTE_SEGMENTS.parkingLotList,
    canActivate: [authGuard],
    loadComponent: () => import('./features/parking-lot-list/parking-lot-list'),
  },
];

export default parkingLotRoutes;
