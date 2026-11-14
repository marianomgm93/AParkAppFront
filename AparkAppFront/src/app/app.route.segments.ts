export const ROUTE_SEGMENTS= {
    users: 'user',
    auth: 'auth',
    login: 'login',
    signup: 'register',
    userList: 'user-list',
} as const;

export const ROUTE_COMMANDS = {
    login: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.login}`],
    signup: [`/${ROUTE_SEGMENTS.auth}/${ROUTE_SEGMENTS.signup}`],
    userList: [`/${ROUTE_SEGMENTS.users}/${ROUTE_SEGMENTS.userList}`],
}as const;