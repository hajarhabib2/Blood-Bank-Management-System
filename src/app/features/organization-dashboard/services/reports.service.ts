import { Injectable } from '@angular/core';
import { api } from '../../../core/api/axios.config';
import { Report } from '../../../core/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  getAll() {
    return api.get<Report[]>('/reports');
  }

  getById(id: string) {
    return api.get<Report>(`/reports/${id}`);
  }

  add(report: Omit<Report, 'id'>) {
    return api.post('/reports', report);
  }

  update(id: string, data: Partial<Report>) {
    return api.patch(`/reports/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/reports/${id}`);
  }
}
