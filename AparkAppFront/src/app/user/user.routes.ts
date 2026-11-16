import { Routes } from "@angular/router";
import { ROUTE_SEGMENTS } from "../app.route.segments";

const userRoutes : Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_SEGMENTS.userList
    },
    {
        path: ROUTE_SEGMENTS.userList,
        loadComponent: () => import('./features/user-list/user-list')
    }
]
export default userRoutes;