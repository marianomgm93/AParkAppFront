import ReservationDetail from "./reservation/feature/reservation-detail/reservation-detail";

export const ROUTE_SEGMENTS= {
    home: '',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
<<<<<<< HEAD
    vehicles: 'vehicles',
    vehicleNew: 'new',
    vehicleEdit: 'edit',
    vehicleForm: 'form',
    spots: 'spots',
=======
    offers: 'offer-list',
    reservation: 'reservation',
    reservations: 'reservation-list',

>>>>>>> origin/develop
} as const;

export const ROUTE_COMMANDS = {
    home: ['/'],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
<<<<<<< HEAD
    vehicleList: [`/${ROUTE_SEGMENTS.vehicles}`],
     vehicleForm: [`/${ROUTE_SEGMENTS.vehicles}/${ROUTE_SEGMENTS.vehicleForm}`],

=======
    offers: [`/${ROUTE_SEGMENTS.offers}`],
    reservations: [`/${ROUTE_SEGMENTS.reservations}`],
>>>>>>> origin/develop
}as const;