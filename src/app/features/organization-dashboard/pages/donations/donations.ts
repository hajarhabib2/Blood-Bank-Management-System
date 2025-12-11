import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Donor } from '../../../../core/models/donor.model';
import { Donation, DonationStatus } from '../../../../core/models/donation.model';
import { DonorsService } from '../../services/donors.service';
import { InventoryService } from '../../services/inventory.service';
import { DonationsService } from '../../services/donations.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './donations.html',
  styleUrls: ['./donations.css'],
})
export class DonationsComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;
  @Input() organizationId!: string;
  @Output() addDonation = new EventEmitter<void>();
  @Output() statsChange = new EventEmitter<{ todayDonations: number }>();
  @Output() inventoryUpdated = new EventEmitter<void>();

  donors: Donor[] = [];
  donations: Donation[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private donorsService: DonorsService,
    private inventoryService: InventoryService,
    private donationsService: DonationsService
  ) {}

  ngOnInit(): void {
    void this.loadDonors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      void this.loadDonors();
    }
  }

  async onMarkComplete(donation: Donation): Promise<void> {
    try {
      // Add corresponding unit to inventory
      const collectedDate = new Date();
      const expiryDate = new Date(collectedDate.getTime() + 42 * 24 * 60 * 60 * 1000); // ~42 days

      await this.inventoryService.add({
        bloodType: donation.bloodType,
        collectedDate: collectedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: 'available',
        donorId: donation.donorId || undefined,
        organizationId: this.organizationId,
        location: 'Main Storage',
      });

      await this.donationsService.update(donation.id, {
        status: 'completed',
      });

      this.inventoryUpdated.emit();
      await this.loadDonors();
    } catch (err) {
      console.warn('Failed to update donor status', err);
    }
  }

  private async loadDonors(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const [donorsRes, donationsRes] = await Promise.all([
        this.donorsService.getAll(),
        this.donationsService.getAll(),
      ]);
      const donors = (donorsRes?.data ?? []).filter(
        (donor: Donor) => donor.organizationId === this.organizationId
      );
      const donations = (donationsRes?.data ?? []).filter(
        (donation: Donation) => donation.organizationId === this.organizationId
      );
      this.donations = donations;
      this.emitStats(donations);
    } catch (err: any) {
      this.donors = [];
      this.error = err?.message ?? 'Failed to load donors';
      this.emitStats([]);
    } finally {
      this.isLoading = false;
    }
  }

  private emitStats(donations?: Donation[]): void {
    const list = donations ?? [];
    const today = new Date().toDateString();
    const todayDonations = list.filter(
      (d) => new Date(d.donationDate).toDateString() === today && d.status === 'completed'
    ).length;
    this.statsChange.emit({ todayDonations });
  }

  formatTime(time: string): string {
    return time;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
      deferred: 'bg-orange-100 text-orange-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  onAddDonation(): void {
    this.addDonation.emit();
  }

  onMarkCompleteClicked(donation: Donation): void {
    void this.onMarkComplete(donation);
  }
 
}
