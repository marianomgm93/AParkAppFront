
export const ROUTE_SEGMENTS= {
    home: 'home',
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
    offer: 'offer',
    offerDetail: 'offer-detail',
    offerList: 'offer-list',
    offerCreate: 'offer-create',
    reservation: 'reservation',
    reservationList: 'reservation-list',
    reservationDetail: 'reservation-detail',
    parkingLot: 'parking-lot',
    parkingLotList: 'parking-lot-list',
    parkingLotForm: 'parking-lot-form'

} as const;

export const ROUTE_COMMANDS = {
    home: [`/${ROUTE_SEGMENTS.home}`],
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
    offerList: [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerList}`],
    offerCreate: [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerCreate}`],
    offerDetail: (id: string | number) => [`/${ROUTE_SEGMENTS.offer}/${ROUTE_SEGMENTS.offerDetail}`, id],
    reservationList: [`/${ROUTE_SEGMENTS.reservation}/${ROUTE_SEGMENTS.reservationList}`],
    reservationDetail: (id: string | number) => [`/${ROUTE_SEGMENTS.reservation}/${ROUTE_SEGMENTS.reservationDetail}`, id],
    parkingLotList: [`/${ROUTE_SEGMENTS.parkingLot}/${ROUTE_SEGMENTS.parkingLotList}`],
    parkingLotForm: [`/${ROUTE_SEGMENTS.parkingLotForm}/${ROUTE_SEGMENTS.parkingLotForm}`],
    parkingLotEdit: (id: string | number) => [`/${ROUTE_SEGMENTS.parkingLot}/${ROUTE_SEGMENTS.parkingLotForm}`, id],
}as const;