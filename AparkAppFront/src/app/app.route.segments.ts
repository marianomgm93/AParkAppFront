export const ROUTE_SEGMENTS= {
    home: '',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
    offers: 'offer-list',
    reservations: 'reservation-list'

} as const;

export const ROUTE_COMMANDS = {
    home: ['/'],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
    offers: [`/${ROUTE_SEGMENTS.offers}`],
    reservations: [`/${ROUTE_SEGMENTS.reservations}`]
}as const;