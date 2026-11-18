import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: 'register', component: RegisterForm },
  { path: 'login', component: LoginForm },
  { path: 'spots', component: SpotCatalog },
  { path: 'spot-nuevo', component: SpotForm },
  { path: 'spot-detalle/:id', component: SpotDetails },
  {
    path: 'vehicles',
    loadChildren: () => import('./vehicle/vehicle.routes').then((m) => m.vehicleRoutes),
  },
  { path: '', pathMatch: 'full', redirectTo: 'spots' },
  { path: '**', redirectTo: '/' },
];
