import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { BloodUnit } from '../../../core/models/blood-unit.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  getAll() {
    return api.get<BloodUnit[]>('/inventory');
  }

  getById(id: string) {
    return api.get<BloodUnit>(`/inventory/${id}`);
  }

  add(unit: Omit<BloodUnit, 'id'>) {
    return api.post('/inventory', unit);
  }

  update(id: string, data: Partial<BloodUnit>) {
    return api.patch(`/inventory/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/inventory/${id}`);
  }
}
