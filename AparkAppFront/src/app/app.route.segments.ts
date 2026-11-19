import ReservationDetail from "./reservation/feature/reservation-detail/reservation-detail";

export const ROUTE_SEGMENTS= {
    home: '',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
    offers: 'offer-list',
    reservation: 'reservation',
    reservations: 'reservation-list',
    spots: 'spot-list',
    spotNew: 'new',
    spotEdit: 'edit',
    spotDetail: 'details',
    vehicles: 'vehicle-list', 
    vehicleNew: 'new',
    vehicleEdit: 'edit',
    vehicleDetail: 'details',

} as const;

export const ROUTE_COMMANDS = {
    home: ['/'],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
    offers: [`/${ROUTE_SEGMENTS.offers}`],
    reservations: [`/${ROUTE_SEGMENTS.reservations}`],
    spots: [`/${ROUTE_SEGMENTS.spots}`],
    spotNew: [`/${ROUTE_SEGMENTS.spots}/${ROUTE_SEGMENTS.spotNew}`],
    spotEdit: (id: string | number) => [`/${ROUTE_SEGMENTS.spots}`, id, ROUTE_SEGMENTS.spotEdit],
    spotDetail: (id: string | number) => [`/${ROUTE_SEGMENTS.spots}`, id, ROUTE_SEGMENTS.spotDetail],
    vehicles: [`/${ROUTE_SEGMENTS.vehicles}`],
    vehicleNew: [`/${ROUTE_SEGMENTS.vehicles}/${ROUTE_SEGMENTS.vehicleNew}`],
    vehicleEdit: (id: string | number) => [`/${ROUTE_SEGMENTS.vehicles}`, id, ROUTE_SEGMENTS.vehicleEdit],
    vehicleDetail: (id: string | number) => [`/${ROUTE_SEGMENTS.vehicles}`, id, ROUTE_SEGMENTS.vehicleDetail],
}as const;