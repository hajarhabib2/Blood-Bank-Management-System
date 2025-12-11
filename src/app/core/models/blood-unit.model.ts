import { BloodType } from "./blood-request.model";

export interface BloodUnit {
  id: string;
  organizationId: string;
  bloodType: BloodType;
  collectedDate: string;
  expiryDate: string;
  status: 'available' | 'reserved' | 'expired' | 'used' | 'quarantined';
  donorId?: string;
  location?: string;
}
