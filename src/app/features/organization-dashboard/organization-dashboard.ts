import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InventoryService } from './services/inventory.service';
import { RequestsService } from './services/requests.service';
import { DeliveriesService } from './services/deliveries.service';
import { ReportsService } from './services/reports.service';

import { OverviewComponent } from './pages/overview/overview';
import { InventoryComponent } from './pages/inventory/inventory';
import { DonationsComponent } from './pages/donations/donations';
import { RequestsComponent } from './pages/requests/requests';
import { DeliveriesComponent } from './pages/deliveries/deliveries';
import { RequestModalComponent } from './components/request-modal/request-modal';
import { DonationModalComponent } from './components/donor-modal/donor-modal';
import { ReportComponent } from './pages/report/report';
import { Alert } from '../../core/models/Alert.model';
import { Report } from '../../core/models/report.model';
import { BloodRequest } from '../../core/models/blood-request.model';
import { Delivery } from '../../core/models/delivery.model';
import { BloodUnit } from '../../core/models/blood-unit.model';
import { Donation } from '../../core/models/donation.model';
import { DonationsService } from './services/donations.service';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverviewComponent,
    InventoryComponent,
    DonationsComponent,
    RequestsComponent,
    DeliveriesComponent,
    RequestModalComponent,
    DonationModalComponent,
    ReportComponent,
  ],
  templateUrl: './organization-dashboard.html',
  styleUrls: ['./organization-dashboard.css'],
})
export class OrganizationDashboardComponent implements OnInit, OnDestroy {
  // UI State
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  activeSection: 'overview' | 'inventory' | 'donations' | 'requests' | 'deliveries' | 'reports' =
    'overview';

  // Data
  alerts: Alert[] = [];
  dailyReport: Report | null = null;

  // Quick Stats
  totalAvailableUnits = 0;
  unitsExpiringSoon = 0;
  activeRequests = 0;
  todayDonations = 0;
  pendingDeliveries = 0;

  // Child refresh triggers
  inventoryRefreshToken = 0;
  donorRefreshToken = 0;
  requestRefreshToken = 0;
  deliveryRefreshToken = 0;

  // Forms
  requestForm!: FormGroup;
  donationForm!: FormGroup;

  readonly organizationId = 'ORG-001';
  readonly currentDate = new Date().toLocaleDateString();

  // Modals
  showRequestModal = false;
  showDonationModal = false;

  // Loading / error state
  isLoading = false;
  error: string | null = null;

  // Note: services in this feature return Promise-based axios responses.

  constructor(
    private inventoryService: InventoryService,
    private requestsService: RequestsService,
    private donationsService: DonationsService,
    private deliveriesService: DeliveriesService,
    private reportsService: ReportsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadDailyReport();
  }

  ngOnDestroy(): void {
    // cleanup (no rx subscriptions kept here)
  }

  private initializeForms(): void {
    this.requestForm = this.fb.group({
      hospitalName: ['', Validators.required],
      patientName: [''],
      bloodType: ['', Validators.required],
      unitsNeeded: [1, [Validators.required, Validators.min(1)]],
      priority: ['medium', Validators.required],
      location: this.fb.group({
        address: [''],
      }),
    });

    this.donationForm = this.fb.group({
      donorId: [''],
      donorName: ['', Validators.required],
      bloodType: ['', Validators.required],
      unitsCollected: [1, [Validators.required, Validators.min(1)]],
      donationDate: [new Date().toISOString().split('T')[0], Validators.required],
      donationTime: [new Date().toTimeString().slice(0, 5), Validators.required],
      location: [''],
      notes: [''],
    });
  }

  private loadDailyReport(): void {
    const today = new Date().toISOString().split('T')[0];

    Promise.all([
      this.donationsService.getAll(),
      this.requestsService.getAll(),
      this.deliveriesService.getAll(),
      this.inventoryService.getAll(),
    ])
      .then(([donationsRes, requestsRes, deliveriesRes, inventoryRes]) => {
        const donations: Donation[] = (donationsRes.data || []).filter(
          (donation: Donation) => donation.organizationId === this.organizationId
        );
        const requests: BloodRequest[] = (requestsRes.data || []).filter(
          (request: BloodRequest) => request.organizationId === this.organizationId
        );
        const deliveries: Delivery[] = (deliveriesRes.data || []).filter(
          (delivery: Delivery) => delivery.organizationId === this.organizationId
        );
        const inventory: BloodUnit[] = (inventoryRes.data || []).filter(
          (unit: BloodUnit) => unit.organizationId === this.organizationId
        );

        const reportDate = new Date(today);
        const dayStart = new Date(reportDate.setHours(0, 0, 0, 0));
        const dayEnd = new Date(reportDate.setHours(23, 59, 59, 999));

        const dayDonations = donations.filter((donation: Donation) => {
          const donationDate = new Date(donation.donationDate);
          return donationDate >= dayStart && donationDate <= dayEnd && donation.status === 'completed';
        }).length;

        const dayRequests = requests.filter((r: any) => {
          const requestDate = new Date(r.requestedDate);
          return requestDate >= dayStart && requestDate <= dayEnd;
        }).length;

        const dayDeliveries = deliveries.filter((d: any) => {
          if (!d.actualArrival) return false;
          const deliveryDate = new Date(d.actualArrival);
          return deliveryDate >= dayStart && deliveryDate <= dayEnd && d.status === 'delivered';
        }).length;

        const bloodTypes: any[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const inventoryChanges = bloodTypes.map((bt) => {
          const dayUnits = inventory.filter((u: any) => {
            const collected = new Date(u.collectedDate);
            const expired = u.status === 'expired' ? new Date(u.expiryDate) : null;
            return (
              u.bloodType === bt &&
              ((collected >= dayStart && collected <= dayEnd) ||
                (expired && expired >= dayStart && expired <= dayEnd))
            );
          });

          return {
            bloodType: bt,
            added: dayUnits.filter(
              (u: any) =>
                new Date(u.collectedDate) >= dayStart && new Date(u.collectedDate) <= dayEnd
            ).length,
            used: 0,
            expired: dayUnits.filter((u: any) => u.status === 'expired').length,
          };
        });

        this.dailyReport = {
          organizationId: this.organizationId,
          date: today,
          totalDonations: dayDonations,
          totalRequests: dayRequests,
          completedDeliveries: dayDeliveries,
          inventoryChanges,
        } as any;
      })
      .catch((err) => {
        console.warn('Failed to load daily report', err);
        this.dailyReport = null;
      });
  }

  onInventoryStatsChange(stats: { totalAvailableUnits: number; unitsExpiringSoon: number }): void {
    this.totalAvailableUnits = stats.totalAvailableUnits;
    this.unitsExpiringSoon = stats.unitsExpiringSoon;
  }

  onDonorStatsChange(stats: { todayDonations: number }): void {
    this.todayDonations = stats.todayDonations;
  }

  onRequestStatsChange(stats: { activeRequests: number }): void {
    this.activeRequests = stats.activeRequests;
  }

  onDeliveryStatsChange(stats: { pendingDeliveries: number }): void {
    this.pendingDeliveries = stats.pendingDeliveries;
  }

  onDonorInventoryUpdated(): void {
    this.inventoryRefreshToken++;
  }

  onRequestDeliveriesChange(): void {
    this.deliveryRefreshToken++;
  }

  openNewRequest(): void {
    this.requestForm.reset({
      priority: 'medium',
      unitsNeeded: 1,
    });
    this.showRequestModal = true;
  }

  saveRequest(): void {
    if (this.requestForm.invalid) return;
    const data = this.requestForm.value;
    this.requestsService
      .add({
        ...data,
        requestedDate: new Date().toISOString(),
        requestedTime: new Date().toTimeString().slice(0, 5),
        status: 'pending',
        organizationId: this.organizationId,
      })
      .then(() => {
        this.requestRefreshToken++;
      })
      .finally(() => {
        this.showRequestModal = false;
      });
  }

  // ========== DONORS ==========
  openNewDonation(): void {
    this.donationForm.reset({
      donorId: '',
      donorName: '',
      bloodType: '',
      unitsCollected: 1,
      donationDate: new Date().toISOString().split('T')[0],
      donationTime: new Date().toTimeString().slice(0, 5),
      location: '',
      notes: '',
    });
    this.showDonationModal = true;
  }

  saveDonation(): void {
    if (this.donationForm.invalid) return;
    const value = this.donationForm.value;
    const donationDateTime = new Date(`${value.donationDate}T${value.donationTime}`);
    const donationDateIso = donationDateTime.toISOString();
    const expiryDate = new Date(donationDateTime.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString();

    this.donationsService
      .add({
        organizationId: this.organizationId,
        donorId: value.donorId ? value.donorId : null,
        donorName: value.donorName,
        bloodType: value.bloodType,
        donationDate: donationDateIso,
        donationTime: value.donationTime,
        unitsCollected: value.unitsCollected,
        status: 'completed',
        location: value.location || 'Main Donation Center',
        notes: value.notes || '',
      })
      .then(() =>
        this.inventoryService.add({
          organizationId: this.organizationId,
          bloodType: value.bloodType,
          collectedDate: donationDateIso,
          expiryDate,
          status: 'available',
          donorId: value.donorId || undefined,
          location: value.location || 'Main Donation Center',
        })
      )
      .then(() => {
        this.inventoryRefreshToken++;
        this.donorRefreshToken++;
      })
      .finally(() => {
        this.showDonationModal = false;
      });
  }

  // ========== ALERTS ==========
  acknowledgeAlert(alert: Alert): void {
    // No AlertsService available in this feature set; mark locally
    const idx = this.alerts.findIndex((a) => a.id === alert.id);
    if (idx >= 0) {
      this.alerts[idx].acknowledged = true;
    }
  }

  closeModals(): void {
    this.showRequestModal = false;
    this.showDonationModal = false;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.sidebarMobileOpen = !this.sidebarMobileOpen;
  }

  closeMobileSidebar(): void {
    this.sidebarMobileOpen = false;
  }

  setActiveSection(
    section: 'overview' | 'inventory' | 'donations' | 'requests' | 'deliveries' | 'reports'
  ): void {
    this.activeSection = section;
    // Close mobile sidebar when navigating
    this.sidebarMobileOpen = false;
  }
}
