import { Routes } from '@angular/router';
import { RegisterForm } from './auth/features/register-form/register-form';
import { LoginForm } from './auth/features/login-form/login-form';
import { SpotForm } from './spot/features/spot-form/spot-form';
import { SpotDetails } from './spot/features/spot-details/spot-details';
import { SpotCatalog } from './spot/features/spot-catalog/spot-catalog';

export const routes: Routes = [
  { path: 'register', component: RegisterForm },
  { path: 'login', component: LoginForm },
  { path: 'spots', component: SpotCatalog },
  { path: 'spot-nuevo', component: SpotForm },
  { path: 'spot-detalle/:id', component: SpotDetails },
  { path: '', pathMatch: 'full', redirectTo: 'spots' },
  { path: '**', redirectTo: '/' }
];
