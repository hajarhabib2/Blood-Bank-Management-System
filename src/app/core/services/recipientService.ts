import { Injectable } from '@angular/core';
import { api } from '../../core/api/axios.config';

export interface UserPayload {
  email: string;
  password?: string;
  role: 'recipient' | 'donor';
}

export interface RecipientProfilePayload {
  fullName: string;
  phone: string;
  governorate: string;
  district: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  idCard: null;
  registrationDate: string; // سنخزن ISO string لتفادي مشاكل
  status: 'pending' | 'verified' | 'rejected';
}

export interface RegistrationPayload {
  accountInfo: UserPayload;
  profile: RecipientProfilePayload;
}

@Injectable({
  providedIn: 'root',
})
export class RecipientService {
  private accountsUrl = '/accounts';
  private recipientsUrl = '/recipients';

  constructor() {
    console.log('RecipientService initialized with JSON Server mode');
  }

  /**
   * يسجل الحساب في /accounts ثم الملف الشخصي في /recipients
   */
  async registerRecipientFlow(
    payload: RegistrationPayload
  ): Promise<{ userId: string; fullName: string }> {
    try {
      console.log('Sending registration data to JSON Server...', payload);

      // 1) إنشاء الحساب
      const { data: account } = await api.post(this.accountsUrl, {
        email: payload.accountInfo.email,
        password: payload.accountInfo.password,
        role: payload.accountInfo.role || 'recipient',
      });

      console.log('Account created:', account);

      // 2) إنشاء الملف الشخصي وربطه بـ userId
      const profileToSave = {
        ...payload.profile,
        userId: account.id,
      };

      const { data: profile } = await api.post(this.recipientsUrl, profileToSave);

      console.log('Profile created:', profile);

      return {
        userId: String(account.id),
        fullName: payload.profile.fullName,
      };
    } catch (error) {
      console.error('Error while registering:', error);
      throw error;
    }
  }
}
