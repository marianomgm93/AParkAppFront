export interface User {
  id: string | number;
  email: string;
  role: string;
  name: string;
}
export type UserFormModel = Omit<User, 'id' | 'role'>;

