export interface User {
  id: string | number;
  email: string;
  roles: string;
  name: string;
}
export type UserFormModel = Omit<User, 'id' | 'role'>;

