import { BloodType } from './blood-request.model';

export type DonationStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Donation {
  id: string;
  organizationId: string;
  donorId?: string | null;
  donorName: string;
  bloodType: BloodType;
  donationDate: string;
  donationTime: string;
  unitsCollected: number;
  status: DonationStatus;
  location?: string;
  notes?: string;
}

