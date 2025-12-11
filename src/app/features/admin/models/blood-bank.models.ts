export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface BloodUnit {
  id: string;
  bloodType: BloodType;
  collectedDate: string;
  expiryDate: string;
  status: 'available' | 'reserved' | 'expired' | 'used';
  donorId?: string;
  location?: string;
}

export interface InventorySummary {
  bloodType: BloodType;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  expiredUnits: number;
  expiringSoon: number;
  earliestExpiry?: string;
}

export type RequestStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'rejected';

export interface BloodRequest {
  id: string;
  requestNumber: string;
  patientName?: string;
  hospitalName: string;
  bloodType: BloodType;
  unitsNeeded: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedDate: string;
  requestedTime: string;
  status: RequestStatus;
  assignedStaff?: string;
  eta?: string;
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  donationDate: string;
  donationTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'pending';
  eligibilityStatus: 'eligible' | 'ineligible' | 'pending';
  lastDonationDate?: string;
  totalDonations: number;
}

export type DeliveryStatus = 'scheduled' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';

export interface Delivery {
  id: string;
  requestId: string;
  requestNumber: string;
  driverName: string;
  vehicleId: string;
  status: DeliveryStatus;
  scheduledTime: string;
  estimatedArrival?: string;
  actualArrival?: string;
  destination: {
    name: string;
    address: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export type AlertType = 'low_stock' | 'near_expiry' | 'urgent_request' | 'delivery_delay';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  bloodType?: BloodType;
  relatedEntityId?: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface DailyReport {
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

