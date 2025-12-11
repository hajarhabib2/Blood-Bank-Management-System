import { BloodType } from "./blood-request.model";

export interface Donor {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  donationDate: string;
  donationTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'pending' | 'deferred';
  eligibilityStatus: 'eligible' | 'ineligible' | 'pending';
  lastDonationDate?: string;
  totalDonations: number;
}