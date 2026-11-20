import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS } from '../app.route.segments';
import { roleGuard } from '../auth/auth-guard';

const parkingSpotRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_SEGMENTS.parkingSpotList,
  },
  {
    path: ROUTE_SEGMENTS.parkingSpotList,
    loadComponent: () => import('./features/spot-catalog/spot-catalog'),
  },
  {
    path: ROUTE_SEGMENTS.parkingSpotCreate,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OWNER'] },
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.parkingSpotEdit}/:id`,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_OWNER'] },
    loadComponent: () => import('./features/spot-form/spot-form'),
  },
  {
    path: `${ROUTE_SEGMENTS.parkingSpotDetail}/:id`,
    loadComponent: () => import('./features/spot-details/spot-details'),
  },
];
export default parkingSpotRoutes;
