import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { Donor } from '../../../core/models/donor.model';

@Injectable({ providedIn: 'root' })
export class DonorsService {
  
  getAll() {
    return api.get<Donor[]>('/donors');
  }

  getById(id: string) {
    return api.get<Donor>(`/donors/${id}`);
  }

  add(donor: Omit<Donor, 'id'>) {
    return api.post('/donors', donor);
  }

  update(id: string, data: Partial<Donor>) {
    return api.patch(`/donors/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/donors/${id}`);
  }
}
