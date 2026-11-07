import { Routes } from '@angular/router';
import { RegisterForm } from './auth/features/register-form/register-form';
import { LoginForm } from './auth/features/login-form/login-form';

export const routes: Routes = [
    {path: 'register', component: RegisterForm},
    {path: 'login', component:LoginForm},
    {path:'', pathMatch:'full' , redirectTo:'register'},
    {path:'**' , redirectTo:'/'}
];
