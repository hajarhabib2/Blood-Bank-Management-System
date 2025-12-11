export interface BloodRequest {
  id: string;
  organizationId: string;
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

export type RequestStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'rejected';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';