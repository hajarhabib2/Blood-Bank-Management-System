import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { BloodRequest } from '../../../core/models/blood-request.model';

@Injectable({ providedIn: 'root' })
export class RequestsService {

  getAll() {
    return api.get<BloodRequest[]>('/requests');
  }

  getById(id: string) {
    return api.get<BloodRequest>(`/requests/${id}`);
  }

  add(request: Omit<BloodRequest, 'id' | 'requestNumber'>) {
    const payload = {
      ...request,
      requestNumber: `REQ-${Date.now()}`
    };
    return api.post('/requests', payload);
  }

  update(id: string, data: Partial<BloodRequest>) {
    return api.patch(`/requests/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/requests/${id}`);
  }
}
