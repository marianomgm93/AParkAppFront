import { Routes } from '@angular/router';

const ticketRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/ticket-list/ticket-list'),
  },
];

export default ticketRoutes;
