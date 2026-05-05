import { Injectable } from '@angular/core';
import { api } from '../api/axios.config';

//  UserPayload مع id
export interface UserPayload {
  id: string;
  email: string;
  password?: string;
  role: 'recipient' | 'donor' | 'admin' | 'organization';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accountsUrl = '/accounts';
  private usersUrl = '/users';

  //  تسجيل الدخول
  async login(email: string, password: string): Promise<UserPayload | null> {
    try {
      console.log('AuthService.login called with:', email, password);

      // 🔹 جلب الحسابات العادية
      const { data: accounts } = await api.get(this.accountsUrl, { params: { email } });
      const account = accounts?.find((u: any) => u.email === email && u.password === password);

      // 🔹 جلب المستخدمين الادمن والاورج
      const { data: users } = await api.get(this.usersUrl, { params: { email } });
      const user = users?.find((u: any) => u.email === email && u.password === password);

      if (account) {
        console.log('Login successful (account):', account);
        return {
          id: account.id,
          email: account.email,
          password: account.password,
          role: account.role,
        };
      }

      if (user) {
        console.log('Login successful (user):', user);

        // 🔹 إعادة التوجيه حسب الدور
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else if (user.role === 'organization') {
          window.location.href = '/organization-dashboard';
        }

        return {
          id: user.id,
          email: user.email,
          password: user.password,
          role: user.role,
        };
      }

      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  // جلب بيانات المستفيد حسب id
  async getRecipientProfileByUserId(userId: string) {
    try {
      const { data } = await api.get('/recipients', { params: { userId } });
      if (data && data.length > 0) return data[0];
      return null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }
}
