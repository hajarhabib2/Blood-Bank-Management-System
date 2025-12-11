import { BloodType } from "./blood-request.model";

export interface InventorySummary {
  bloodType: BloodType;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  expiredUnits: number;
  expiringSoon: number;
  earliestExpiry?: string;
}
