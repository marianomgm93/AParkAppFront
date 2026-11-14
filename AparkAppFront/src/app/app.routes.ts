import { Routes } from '@angular/router';
import { RegisterForm } from './auth/features/register-form/register-form';
import { LoginForm } from './auth/features/login-form/login-form';
import { AddressForm } from './address/features/address-form/address-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginForm },
  { path: 'register', component: RegisterForm },
  { path: 'address', component: AddressForm },
  { path: '**', redirectTo: 'login' },
];
