import { Routes } from "@angular/router";
import { ROUTE_SEGMENTS } from "../app.route.segments";

const reservationRoutes : Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_SEGMENTS.reservations
    },
    {
        path: ROUTE_SEGMENTS.reservations,
        loadComponent: () => import('./features/reservation-list/reservation-list')
    }
]
export default reservationRoutes;