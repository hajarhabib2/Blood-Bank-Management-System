import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../../core/models/Alert.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent {
  @Input() totalAvailableUnits = 0;
  @Input() unitsExpiringSoon = 0;
  @Input() activeRequests = 0;
  @Input() todayDonations = 0;
  @Input() pendingDeliveries = 0;
  @Input() alerts: Alert[] = [];
  @Output() acknowledgeAlert = new EventEmitter<Alert>();

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  }
}

