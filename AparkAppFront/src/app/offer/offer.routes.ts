import { Routes } from '@angular/router';
const offerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/offer-list/offer-list'),
  },
  {
    path: 'new',
    loadComponent: () => import('./features/offer-form/offer-form'),
  },
];
export default offerRoutes;
