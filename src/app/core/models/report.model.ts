import { BloodType } from "./blood-request.model";

export interface Report {
  organizationId: string;
  date: string;
  totalDonations: number;
  totalRequests: number;
  completedDeliveries: number;
  inventoryChanges: {
    bloodType: BloodType;
    added: number;
    used: number;
    expired: number;
  }[];
}

