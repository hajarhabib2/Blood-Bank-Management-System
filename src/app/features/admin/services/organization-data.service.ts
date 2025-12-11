import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  BloodUnit,
  InventorySummary,
  BloodType,
  BloodRequest,
  RequestStatus,
  Donor,
  Delivery,
  DeliveryStatus,
  Alert,
  AlertType,
  AlertSeverity,
  DailyReport
} from '../models/blood-bank.models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationDataService {
  private readonly INVENTORY_KEY = 'org_inventory_v1';
  private readonly REQUESTS_KEY = 'org_requests_v1';
  private readonly DONORS_KEY = 'org_donors_v1';
  private readonly DELIVERIES_KEY = 'org_deliveries_v1';
  private readonly ALERTS_KEY = 'org_alerts_v1';

  private inventory$ = new BehaviorSubject<BloodUnit[]>(this.loadInventory());
  private requests$ = new BehaviorSubject<BloodRequest[]>(this.loadRequests());
  private donors$ = new BehaviorSubject<Donor[]>(this.loadDonors());
  private deliveries$ = new BehaviorSubject<Delivery[]>(this.loadDeliveries());
  private alerts$ = new BehaviorSubject<Alert[]>(this.loadAlerts());

  constructor() {
    this.initializeSampleData();
  }

  // ========== INVENTORY ==========
  getInventory(): Observable<BloodUnit[]> {
    return this.inventory$.asObservable();
  }

  getInventorySummary(): Observable<InventorySummary[]> {
    return new Observable(observer => {
      this.inventory$.subscribe(units => {
        const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const summary: InventorySummary[] = bloodTypes.map(bt => {
          const typeUnits = units.filter(u => u.bloodType === bt);
          const now = new Date();
          const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const expiringSoon = typeUnits.filter(u => {
            const expiry = new Date(u.expiryDate);
            return expiry <= sevenDaysFromNow && expiry > now && u.status !== 'expired';
          }).length;

          const expiryDates = typeUnits
            .filter(u => u.status === 'available' || u.status === 'reserved')
            .map(u => new Date(u.expiryDate))
            .filter(d => d > now)
            .sort((a, b) => a.getTime() - b.getTime());

          return {
            bloodType: bt,
            totalUnits: typeUnits.length,
            availableUnits: typeUnits.filter(u => u.status === 'available').length,
            reservedUnits: typeUnits.filter(u => u.status === 'reserved').length,
            expiredUnits: typeUnits.filter(u => u.status === 'expired').length,
            expiringSoon,
            earliestExpiry: expiryDates.length > 0 ? expiryDates[0].toISOString() : undefined
          };
        });
        observer.next(summary);
      });
    });
  }

  addBloodUnit(unit: Omit<BloodUnit, 'id'>): BloodUnit {
    const newUnit: BloodUnit = {
      ...unit,
      id: uuidv4()
    };
    const next = [newUnit, ...this.inventory$.value];
    this.setInventory(next);
    this.checkAlerts();
    return newUnit;
  }

  updateUnitStatus(unitId: string, status: BloodUnit['status']) {
    const units = this.inventory$.value;
    const index = units.findIndex(u => u.id === unitId);
    if (index >= 0) {
      units[index].status = status;
      this.setInventory(units);
      this.checkAlerts();
    }
  }

  // ========== REQUESTS ==========
  getRequests(): Observable<BloodRequest[]> {
    return this.requests$.asObservable();
  }

  addRequest(request: Omit<BloodRequest, 'id' | 'requestNumber'>): BloodRequest {
    const newRequest: BloodRequest = {
      ...request,
      id: uuidv4(),
      requestNumber: `REQ-${Date.now()}`
    };
    const next = [newRequest, ...this.requests$.value];
    this.setRequests(next);
    this.checkAlerts();
    return newRequest;
  }

  updateRequest(id: string, patch: Partial<BloodRequest>) {
    const requests = this.requests$.value;
    const index = requests.findIndex(r => r.id === id);
    if (index >= 0) {
      requests[index] = { ...requests[index], ...patch };
      this.setRequests(requests);
      this.checkAlerts();
    }
  }

  // ========== DONORS ==========
  getDonors(): Observable<Donor[]> {
    return this.donors$.asObservable();
  }

  getTodayDonors(): Observable<Donor[]> {
    return new Observable(observer => {
      this.donors$.subscribe(donors => {
        const today = new Date().toDateString();
        const todayDonors = donors.filter(d => 
          new Date(d.donationDate).toDateString() === today
        );
        observer.next(todayDonors);
      });
    });
  }

  addDonor(donor: Omit<Donor, 'id'>): Donor {
    const newDonor: Donor = {
      ...donor,
      id: uuidv4()
    };
    const next = [newDonor, ...this.donors$.value];
    this.setDonors(next);
    return newDonor;
  }

  updateDonor(id: string, patch: Partial<Donor>) {
    const donors = this.donors$.value;
    const index = donors.findIndex(d => d.id === id);
    if (index >= 0) {
      donors[index] = { ...donors[index], ...patch };
      this.setDonors(donors);
    }
  }

  // ========== DELIVERIES ==========
  getDeliveries(): Observable<Delivery[]> {
    return this.deliveries$.asObservable();
  }

  getActiveDeliveries(): Observable<Delivery[]> {
    return new Observable(observer => {
      this.deliveries$.subscribe(deliveries => {
        const active = deliveries.filter(d => 
          d.status === 'scheduled' || d.status === 'in_transit'
        );
        observer.next(active);
      });
    });
  }

  updateDelivery(id: string, patch: Partial<Delivery>) {
    const deliveries = this.deliveries$.value;
    const index = deliveries.findIndex(d => d.id === id);
    if (index >= 0) {
      deliveries[index] = { ...deliveries[index], ...patch };
      this.setDeliveries(deliveries);
    }
  }

  // ========== ALERTS ==========
  getAlerts(): Observable<Alert[]> {
    return this.alerts$.asObservable();
  }

  getUnacknowledgedAlerts(): Observable<Alert[]> {
    return new Observable(observer => {
      this.alerts$.subscribe(alerts => {
        observer.next(alerts.filter(a => !a.acknowledged));
      });
    });
  }

  acknowledgeAlert(id: string) {
    const alerts = this.alerts$.value;
    const index = alerts.findIndex(a => a.id === id);
    if (index >= 0) {
      alerts[index].acknowledged = true;
      this.setAlerts(alerts);
    }
  }

  private checkAlerts() {
    const alerts: Alert[] = [];
    const now = new Date();

    // Check inventory
    this.getInventorySummary().subscribe(summary => {
      summary.forEach(s => {
        // Low stock (less than 5 units)
        if (s.availableUnits < 5) {
          const existing = this.alerts$.value.find(a => 
            a.type === 'low_stock' && a.bloodType === s.bloodType && !a.acknowledged
          );
          if (!existing) {
            alerts.push({
              id: uuidv4(),
              type: 'low_stock',
              severity: s.availableUnits === 0 ? 'critical' : 'warning',
              title: `Low Stock: ${s.bloodType}`,
              message: `Only ${s.availableUnits} units available for ${s.bloodType}`,
              bloodType: s.bloodType,
              createdAt: now.toISOString(),
              acknowledged: false
            });
          }
        }

        // Near expiry
        if (s.expiringSoon > 0) {
          const existing = this.alerts$.value.find(a => 
            a.type === 'near_expiry' && a.bloodType === s.bloodType && !a.acknowledged
          );
          if (!existing) {
            alerts.push({
              id: uuidv4(),
              type: 'near_expiry',
              severity: 'warning',
              title: `Units Expiring Soon: ${s.bloodType}`,
              message: `${s.expiringSoon} units of ${s.bloodType} expiring within 7 days`,
              bloodType: s.bloodType,
              createdAt: now.toISOString(),
              acknowledged: false
            });
          }
        }
      });
    });

    // Check urgent requests
    this.requests$.value.forEach(req => {
      if (req.priority === 'urgent' && req.status === 'pending') {
        const existing = this.alerts$.value.find(a => 
          a.type === 'urgent_request' && a.relatedEntityId === req.id && !a.acknowledged
        );
        if (!existing) {
          alerts.push({
            id: uuidv4(),
            type: 'urgent_request',
            severity: 'critical',
            title: `Urgent Request: ${req.requestNumber}`,
            message: `Urgent request for ${req.unitsNeeded} units of ${req.bloodType}`,
            relatedEntityId: req.id,
            createdAt: now.toISOString(),
            acknowledged: false
          });
        }
      }
    });

    if (alerts.length > 0) {
      const current = this.alerts$.value;
      this.setAlerts([...alerts, ...current]);
    }
  }

  // ========== REPORTS ==========
  getDailyReport(date: string): Observable<DailyReport> {
    return new Observable(observer => {
      combineLatest([
        this.donors$,
        this.requests$,
        this.deliveries$,
        this.inventory$
      ]).subscribe(([donors, requests, deliveries, inventory]) => {
        const reportDate = new Date(date);
        const dayStart = new Date(reportDate.setHours(0, 0, 0, 0));
        const dayEnd = new Date(reportDate.setHours(23, 59, 59, 999));

        const dayDonations = donors.filter(d => {
          const donationDate = new Date(d.donationDate);
          return donationDate >= dayStart && donationDate <= dayEnd && d.status === 'completed';
        }).length;

        const dayRequests = requests.filter(r => {
          const requestDate = new Date(r.requestedDate);
          return requestDate >= dayStart && requestDate <= dayEnd;
        }).length;

        const dayDeliveries = deliveries.filter(d => {
          if (!d.actualArrival) return false;
          const deliveryDate = new Date(d.actualArrival);
          return deliveryDate >= dayStart && deliveryDate <= dayEnd && d.status === 'delivered';
        }).length;

        const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const inventoryChanges = bloodTypes.map(bt => {
          const dayUnits = inventory.filter(u => {
            const collected = new Date(u.collectedDate);
            const expired = u.status === 'expired' ? new Date(u.expiryDate) : null;
            return u.bloodType === bt && (
              (collected >= dayStart && collected <= dayEnd) ||
              (expired && expired >= dayStart && expired <= dayEnd)
            );
          });

          return {
            bloodType: bt,
            added: dayUnits.filter(u => new Date(u.collectedDate) >= dayStart && new Date(u.collectedDate) <= dayEnd).length,
            used: 0, // Would need to track usage separately
            expired: dayUnits.filter(u => u.status === 'expired').length
          };
        });

        observer.next({
          date,
          totalDonations: dayDonations,
          totalRequests: dayRequests,
          completedDeliveries: dayDeliveries,
          inventoryChanges
        });
      });
    });
  }

  // ========== PERSISTENCE ==========
  private setInventory(units: BloodUnit[]) {
    localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(units));
    this.inventory$.next(units);
  }

  private setRequests(requests: BloodRequest[]) {
    localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
    this.requests$.next(requests);
  }

  private setDonors(donors: Donor[]) {
    localStorage.setItem(this.DONORS_KEY, JSON.stringify(donors));
    this.donors$.next(donors);
  }

  private setDeliveries(deliveries: Delivery[]) {
    localStorage.setItem(this.DELIVERIES_KEY, JSON.stringify(deliveries));
    this.deliveries$.next(deliveries);
  }

  private setAlerts(alerts: Alert[]) {
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
    this.alerts$.next(alerts);
  }

  // ========== LOADERS ==========
  private loadInventory(): BloodUnit[] {
    const raw = localStorage.getItem(this.INVENTORY_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  }

  private loadRequests(): BloodRequest[] {
    const raw = localStorage.getItem(this.REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  }

  private loadDonors(): Donor[] {
    const raw = localStorage.getItem(this.DONORS_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  }

  private loadDeliveries(): Delivery[] {
    const raw = localStorage.getItem(this.DELIVERIES_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  }

  private loadAlerts(): Alert[] {
    const raw = localStorage.getItem(this.ALERTS_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  }

  // ========== SAMPLE DATA ==========
  private initializeSampleData() {
    if (this.inventory$.value.length === 0) {
      this.generateSampleInventory();
    }
    if (this.requests$.value.length === 0) {
      this.generateSampleRequests();
    }
    if (this.donors$.value.length === 0) {
      this.generateSampleDonors();
    }
    if (this.deliveries$.value.length === 0) {
      this.generateSampleDeliveries();
    }
  }

  private generateSampleInventory() {
    const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const units: BloodUnit[] = [];
    const now = new Date();

    bloodTypes.forEach(bt => {
      const count = Math.floor(Math.random() * 25) + 5;
      for (let i = 0; i < count; i++) {
        const collectedDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const expiryDate = new Date(collectedDate.getTime() + 42 * 24 * 60 * 60 * 1000);
        
        let status: 'available' | 'reserved' | 'expired' | 'used' = 'available';
        if (expiryDate < now) {
          status = 'expired';
        } else if (Math.random() > 0.75) {
          status = 'reserved';
        }

        units.push({
          id: uuidv4(),
          bloodType: bt,
          collectedDate: collectedDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          status,
          location: 'Main Storage'
        });
      }
    });

    this.setInventory(units);
  }

  private generateSampleRequests() {
    const hospitals = ['City Hospital', 'General Medical Center', 'Emergency Care Unit'];
    const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const statuses: RequestStatus[] = ['pending', 'approved', 'in_transit', 'completed'];
    const requests: BloodRequest[] = [];

    for (let i = 0; i < 15; i++) {
      const requestedDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      requests.push({
        id: uuidv4(),
        requestNumber: `REQ-${Date.now()}-${i}`,
        hospitalName: hospitals[Math.floor(Math.random() * hospitals.length)],
        patientName: `Patient ${i + 1}`,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        unitsNeeded: Math.floor(Math.random() * 4) + 1,
        priority: i % 4 === 0 ? 'urgent' : i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
        requestedDate: requestedDate.toISOString(),
        requestedTime: requestedDate.toTimeString().slice(0, 5),
        status,
        location: {
          address: `${Math.floor(Math.random() * 1000)} Main St, City`
        }
      });
    }

    this.setRequests(requests);
  }

  private generateSampleDonors() {
    const names = ['Ahmed Ali', 'Fatima Hassan', 'Mohamed Ibrahim', 'Sara Ahmed', 'Omar Khaled'];
    const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const donors: Donor[] = [];
    const today = new Date();

    // Today's donors
    for (let i = 0; i < 8; i++) {
      const donationDate = new Date(today);
      donationDate.setHours(9 + i, 0, 0);
      
      donors.push({
        id: uuidv4(),
        name: names[Math.floor(Math.random() * names.length)] + ` ${i + 1}`,
        email: `donor${i}@example.com`,
        phone: `010${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        donationDate: donationDate.toISOString(),
        donationTime: donationDate.toTimeString().slice(0, 5),
        status: i < 3 ? 'completed' : i < 6 ? 'scheduled' : 'pending',
        eligibilityStatus: 'eligible',
        totalDonations: Math.floor(Math.random() * 5) + 1
      });
    }

    this.setDonors(donors);
  }

  private generateSampleDeliveries() {
    const drivers = ['Ahmed Driver', 'Mohamed Logistics'];
    const vehicles = ['VAN-001', 'VAN-002'];
    const requests = this.requests$.value.filter(r => r.status === 'approved' || r.status === 'in_transit');
    const deliveries: Delivery[] = [];

    requests.slice(0, 5).forEach((req, i) => {
      const scheduledTime = new Date(req.requestedDate);
      scheduledTime.setHours(scheduledTime.getHours() + 2);

      deliveries.push({
        id: uuidv4(),
        requestId: req.id,
        requestNumber: req.requestNumber,
        driverName: drivers[i % drivers.length],
        vehicleId: vehicles[i % vehicles.length],
        status: req.status === 'in_transit' ? 'in_transit' : 'scheduled',
        scheduledTime: scheduledTime.toISOString(),
        estimatedArrival: new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        destination: {
          name: req.hospitalName,
          address: req.location?.address || 'Unknown'
        }
      });
    });

    this.setDeliveries(deliveries);
  }
}

