import { Routes } from "@angular/router";
import { ROUTE_SEGMENTS } from "../app.route.segments";

const vehicleRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_SEGMENTS.vehicles
    },
    {
        path: ROUTE_SEGMENTS.vehicles,
        loadComponent: () => import('./features/vehicle-list/vehicle-list')
    },
    {
        path: ROUTE_SEGMENTS.vehicleNew,
        loadComponent: () => import('./features/vehicle-form/vehicle-form')
    },
    {
        path: `:id/${ROUTE_SEGMENTS.vehicleEdit}`,
        loadComponent: () => import('./features/vehicle-form/vehicle-form')
    }
];

export default vehicleRoutes;