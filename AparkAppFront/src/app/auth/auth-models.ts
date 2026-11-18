export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface RegisterFormModel {
    email: string;
    name: string;
    password: string;
};