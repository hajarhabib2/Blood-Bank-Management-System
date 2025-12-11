export type DeliveryStatus = 'scheduled' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';

export interface Delivery {
  id: string;
  organizationId: string;
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