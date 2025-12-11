import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BloodRequest, BloodType, RequestStatus } from '../../../../core/models/blood-request.model';
import { RequestsService } from '../../services/requests.service';
import { DeliveriesService } from '../../services/deliveries.service';
import { Delivery } from '../../../../core/models/delivery.model';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.css']
})
export class RequestsComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;
  @Input() organizationId!: string;
  filteredRequests: BloodRequest[] = [];
  requestFilter = {
    search: '',
    bloodType: '' as BloodType | '',
    status: '' as RequestStatus | ''
  };

  @Output() addRequest = new EventEmitter<void>();
  @Output() statsChange = new EventEmitter<{ activeRequests: number }>();
  @Output() deliveriesChange = new EventEmitter<void>();

  requests: BloodRequest[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private requestsService: RequestsService,
    private deliveriesService: DeliveriesService
  ) {}

  ngOnInit(): void {
    void this.loadRequests();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      void this.loadRequests();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  onAddRequest(): void {
    this.addRequest.emit();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  async onUpdateStatus(request: BloodRequest, status: RequestStatus): Promise<void> {
    try {
      await this.requestsService.update(request.id, { status });
      const idx = this.requests.findIndex((r) => r.id === request.id);
      if (idx >= 0) {
        this.requests[idx].status = status;
        this.applyFilters();
        this.emitStats();
      }

      await this.syncDeliveryForRequest(request, status);
      this.deliveriesChange.emit();
    } catch (err) {
      console.warn('Failed to update request status', err);
    }
  }

  private async loadRequests(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const res = await this.requestsService.getAll();
      this.requests = (res?.data ?? []).filter(
        (request: BloodRequest) => request.organizationId === this.organizationId
      );
      this.applyFilters();
      this.emitStats();
    } catch (err: any) {
      this.requests = [];
      this.filteredRequests = [];
      this.error = err?.message ?? 'Failed to load requests';
      this.emitStats();
    } finally {
      this.isLoading = false;
    }
  }

  private applyFilters(): void {
    const search = this.requestFilter.search.toLowerCase();
    this.filteredRequests = this.requests.filter(request => {
      const patientName = request.patientName?.toLowerCase() ?? '';
      const matchesSearch = !search ||
        request.requestNumber.toLowerCase().includes(search) ||
        request.hospitalName.toLowerCase().includes(search) ||
        patientName.includes(search);

      const matchesBloodType = !this.requestFilter.bloodType || request.bloodType === this.requestFilter.bloodType;
      const matchesStatus = !this.requestFilter.status || request.status === this.requestFilter.status;

      return matchesSearch && matchesBloodType && matchesStatus;
    });
  }

  private emitStats(): void {
    const activeRequests = this.requests.filter(
      (r) => r.status === 'pending' || r.status === 'approved' || r.status === 'in_transit'
    ).length;
    this.statsChange.emit({ activeRequests });
  }

  private async syncDeliveryForRequest(request: BloodRequest, status: RequestStatus): Promise<void> {
    try {
      const deliveriesRes = await this.deliveriesService.getAll();
      const deliveries = (deliveriesRes?.data ?? []).filter(
        (delivery: Delivery) => delivery.organizationId === this.organizationId
      );
      const existing = deliveries.find((delivery: Delivery) => delivery.requestId === request.id);

      if (status === 'approved') {
        if (!existing) {
          await this.deliveriesService.add({
            requestId: request.id,
            requestNumber: request.requestNumber,
            driverName: 'Auto Dispatcher',
            vehicleId: 'AUTO-VAN',
            status: 'scheduled',
            scheduledTime: new Date().toISOString(),
            estimatedArrival: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            destination: {
              name: request.hospitalName,
              address: request.location?.address || 'Not specified'
            },
            organizationId: this.organizationId
          } as Omit<Delivery, 'id'>);
        } else {
          await this.deliveriesService.update(existing.id, {
            status: 'scheduled',
            scheduledTime: new Date().toISOString()
          });
        }
      } else if (status === 'in_transit' && existing) {
        await this.deliveriesService.update(existing.id, {
          status: 'in_transit',
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        });
      } else if (status === 'completed' && existing) {
        await this.deliveriesService.update(existing.id, {
          status: 'delivered',
          actualArrival: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Failed to sync deliveries with request change', err);
    }
  }
}

