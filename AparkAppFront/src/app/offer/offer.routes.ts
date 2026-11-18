import { Routes } from '@angular/router';
const offerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/offer-list/offer-list'),
  },
];
export default offerRoutes;