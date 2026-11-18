import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicle-list/vehicle-list';
import { VehicleFormComponent } from './features/vehicle-form/vehicle-form';

export const vehicleRoutes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'new', component: VehicleFormComponent },
  { path: ':id/edit', component: VehicleFormComponent },
];
