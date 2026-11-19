export const ROUTE_SEGMENTS= {
    home: '',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
    offers: 'offer-list',
<<<<<<< HEAD
    tickets: 'tickets'
=======
    reservations: 'reservation-list'

>>>>>>> develop
} as const;

export const ROUTE_COMMANDS = {
    home: ['/'],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
    offers: [`/${ROUTE_SEGMENTS.offers}`],
<<<<<<< HEAD
    tickets: [`/${ROUTE_SEGMENTS.tickets}`]
=======
    reservations: [`/${ROUTE_SEGMENTS.reservations}`]
>>>>>>> develop
}as const;