import ReservationDetail from "./reservation/feature/reservation-detail/reservation-detail";

export const ROUTE_SEGMENTS= {
    home: '',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
    offer: 'offer',
   // offers: 'offer-list',
    offerDetail: 'offer-detail',
    offerList: 'offer-list',
    offerCreate: 'offer-create',
    reservation: 'reservation',
    reservations: 'reservation-list',

} as const;

export const ROUTE_COMMANDS = {
    home: ['/'],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
    offerList: [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerList}`],
    offerDetail: [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerDetail}`],
    offerCreate: [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerCreate}`],
    reservations: [`/${ROUTE_SEGMENTS.reservations}`],
}as const;