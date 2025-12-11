import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { Delivery } from '../../../core/models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveriesService {

  getAll() {
    return api.get<Delivery[]>('/deliveries');
  }

  getById(id: string) {
    return api.get<Delivery>(`/deliveries/${id}`);
  }

  add(delivery: Omit<Delivery, 'id'>) {
    return api.post('/deliveries', delivery);
  }

  update(id: string, data: Partial<Delivery>) {
    return api.patch(`/deliveries/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/deliveries/${id}`);
  }
}
