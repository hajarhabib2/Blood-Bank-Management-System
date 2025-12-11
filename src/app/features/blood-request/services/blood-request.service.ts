import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';

// 🛑 واجهة البيانات التي ستُرسل إلى الـ API
export interface BloodRequestPayload {
  userId: string; // معرف المستخدم الذي يقوم بالطلب
  unitsNeeded: number;
  requestReason: string;
  neededBefore: string; // تاريخ
  medicalReport?: string; // Base64 أو مسار الملف
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BloodRequestService {
  private requestsUrl = '/bloodRequests'; // نقطة النهاية في db.json

  // 🟢 دالة لتوليد معرّف فريد لكل طلب
  generateId(prefix: string): string {
    return prefix + '-' + Math.random().toString(36).substring(2, 8);
  }

  // 🎯 دالة إرسال طلب الدم وحفظه في db.json
  async submitRequest(payload: BloodRequestPayload) {
    const requestPayload = {
      id: this.generateId('REQ'),
      ...payload,
      status: 'Pending', // حالة مبدئية
      requestedAt: new Date().toISOString(),
    };

    try {
      const response = await api.post(this.requestsUrl, requestPayload);
      return response.data; // إرجاع بيانات الطلب المسجل
    } catch (error) {
      console.error('Error submitting blood request:', error);
      throw new Error('Failed to submit the blood request to the server.');
    }
  }
}

// import { Injectable } from '@angular/core';
// import { api } from '../../../core/api/axios.config';

// // 🛑 واجهة البيانات التي ستُرسل إلى الـ API
// export interface BloodRequestPayload {
//   userId: string; // معرف المستفيد الذي يقوم بالطلب
//   unitsNeeded: number;
//   requestReason: string;
//   neededBefore: string; // تاريخ
//   medicalReport?: string; // Base64
//   notes?: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class BloodRequestService {
//   private requestsUrl = '/bloodRequests'; // نقطة النهاية لجدول طلبات الدم

//   generateId(prefix: string): string {
//     return prefix + '-' + Math.random().toString(36).substring(2, 8);
//   }

//   // 🎯 دالة إرسال طلب الدم
//   async submitRequest(payload: BloodRequestPayload) {
//     // إضافة معرّف الطلب و حالة الطلب
//     const requestPayload = {
//       id: this.generateId('REQ'),
//       ...payload,
//       status: 'Pending', // حالة مبدئية
//       requestedAt: new Date().toISOString(),
//     };

//     try {
//       const response = await api.post(this.requestsUrl, requestPayload);
//       return response.data; // إرجاع بيانات الطلب المسجل
//     } catch (error) {
//       console.error('Error submitting blood request:', error);
//       throw new Error('Failed to submit the blood request to the server.');
//     }
//   }
// }
