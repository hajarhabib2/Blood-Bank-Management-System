import { BloodType } from "./blood-request.model";

export type AlertType = 'low_stock' | 'near_expiry' | 'urgent_request' | 'delivery_delay';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  organizationId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  bloodType?: BloodType;
  relatedEntityId?: string;
  createdAt: string;
  acknowledged: boolean;
}
