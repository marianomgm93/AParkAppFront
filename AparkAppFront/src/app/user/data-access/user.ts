export interface User {
  id: string | number;
  email: string;
  roles?: string[] | string;
  name: string;
  active: boolean;
}
export type UserFormModel = Omit<User, 'id' | 'roles' | 'active'>;

