import { Routes } from '@angular/router';
import { RegisterForm } from './auth/features/register-form/register-form';
import { LoginForm } from './auth/features/login-form/login-form';
import { AddressForm } from './address/features/address-form/address-form';
import { ParkingLotList } from './parking-lot/features/parking-lot-list/parking-lot-list';
import { ParkingLotForm } from './parking-lot/features/parking-lot-form/parking-lot-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginForm },
  { path: 'register', component: RegisterForm },
  { path: 'address', component: AddressForm },
  { path: 'parkingLots', component: ParkingLotList },
  { path: 'parkingLotForm', component: ParkingLotForm },
  { path: 'parkingLotForm/:id', component: ParkingLotForm },
  { path: '**', redirectTo: 'login' },
];
