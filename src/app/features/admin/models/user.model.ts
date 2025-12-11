export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  phone?: string;
  active: boolean;
  createdAt: string;
}
