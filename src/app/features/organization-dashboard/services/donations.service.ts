import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { Donation } from '../../../core/models/donation.model';

@Injectable({ providedIn: 'root' })
export class DonationsService {

  getAll() {
    return api.get<Donation[]>('/donations');
  }

  getById(id: string) {
    return api.get<Donation>(`/donations/${id}`);
  }

  add(donation: Omit<Donation, 'id'>) {
    return api.post('/donations', donation);
  }

  update(id: string, data: Partial<Donation>) {
    return api.patch(`/donations/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/donations/${id}`);
  }
}

