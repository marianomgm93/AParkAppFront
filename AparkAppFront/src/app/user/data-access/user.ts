export interface User {
  id: string | number;
  email: string;
  role: string;
  name: string;
}
export type userFormModel = Omit<User, 'id' | 'role'>;
export interface registerFormModel {
    email: string;
    name: string;
    password: string;
};