import { Routes } from '@angular/router';
import { RegisterForm } from './user/features/register-form/register-form';

export const routes: Routes = [
    {path: 'register', component: RegisterForm},
    {path:'', pathMatch:'full' , redirectTo:'register'},
    {path:'**' , redirectTo:'/'}
];
