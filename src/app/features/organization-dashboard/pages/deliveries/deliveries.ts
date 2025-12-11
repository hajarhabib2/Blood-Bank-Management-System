import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../../../core/models/delivery.model';
import { DeliveriesService } from '../../services/deliveries.service';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deliveries.html',
  styleUrls: ['./deliveries.css']
})
export class DeliveriesComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;
  @Input() organizationId!: string;
  @Output() statsChange = new EventEmitter<{ pendingDeliveries: number }>();

  deliveries: Delivery[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private deliveriesService: DeliveriesService) {}

  ngOnInit(): void {
    void this.loadDeliveries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      void this.loadDeliveries();
    }
  }

  private async loadDeliveries(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const res = await this.deliveriesService.getAll();
      const all = (res?.data ?? []).filter(
        (delivery: Delivery) => delivery.organizationId === this.organizationId
      );
      this.deliveries = all.filter(
        (delivery: Delivery) => delivery.status === 'scheduled' || delivery.status === 'in_transit'
      );
      this.emitStats();
    } catch (err: any) {
      this.deliveries = [];
      this.error = err?.message ?? 'Failed to load deliveries';
      this.emitStats();
    } finally {
      this.isLoading = false;
    }
  }

  private emitStats(): void {
    this.statsChange.emit({ pendingDeliveries: this.deliveries.length });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      delayed: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}

