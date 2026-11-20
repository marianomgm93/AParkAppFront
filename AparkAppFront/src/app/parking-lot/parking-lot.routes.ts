import { Routes } from '@angular/router';

const parkingLotRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'parking-lot-list',
  },
  {
    path: 'parking-lot-form',
    loadComponent: () => import('./features/parking-lot-form/parking-lot-form'),
  },
  {
    path: 'parking-lot-form/:id',
    loadComponent: () => import('./features/parking-lot-form/parking-lot-form'),
  },
  {
    path: 'parking-lot-list',
    loadComponent: () => import('./features/parking-lot-list/parking-lot-list'),
  },
];

export default parkingLotRoutes;
