export interface User {
  id: string | number;
  email: string;
  roles?: string[] | string;
  name: string;
}
export type UserFormModel = Omit<User, 'id' | 'roles'>;

