import { Routes } from '@angular/router';
import { RegisterForm } from './auth/features/register-form/register-form';
import { LoginForm } from './auth/features/login-form/login-form';
import { SpotForm } from './spot/features/spot-form/spot-form';
import { SpotDetails } from './spot/features/spot-details/spot-details';
import { SpotCatalog } from './spot/features/spot-catalog/spot-catalog';

export const routes: Routes = [
    {path: 'register', component: RegisterForm},
    {path: 'login', component:LoginForm},
    {path:'', pathMatch:'full' , redirectTo:'register'},
    {path:'**' , redirectTo:'/'},
    {path: 'spots',component: SpotForm},
    { path: '', redirectTo: 'spots', pathMatch: 'full' },
    { path: 'spots',  component: SpotCatalog },
    {  path: 'spot-detalle/:id', component: SpotDetails }
];
