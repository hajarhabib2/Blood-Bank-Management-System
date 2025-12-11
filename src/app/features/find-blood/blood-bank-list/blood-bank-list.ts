import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BloodDataService, BloodDonor, BloodBank } from '../services/blood-data.service';

@Component({
  selector: 'app-blood-bank-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blood-bank-list.html',
  styleUrl: './blood-bank-list.css'
})
export class BloodBankList implements OnInit {
  activeTab: 'donors' | 'banks' = 'donors';
  bloodDonors: BloodDonor[] = [];
  bloodBanks: BloodBank[] = [];
  loading = false;
  error: string | null = null;

  constructor(private bloodDataService: BloodDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load donors
    this.bloodDataService.getDonors().subscribe({
      next: (donors) => {
        this.bloodDonors = donors;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading donors:', err);
        this.error = 'Failed to load donors. Please try again later.';
        this.loading = false;
      }
    });

    // Load blood banks
    this.bloodDataService.getBloodBanks().subscribe({
      next: (banks) => {
        this.bloodBanks = banks;
      },
      error: (err) => {
        console.error('Error loading blood banks:', err);
        if (!this.error) {
          this.error = 'Failed to load blood banks. Please try again later.';
        }
      }
    });
  }

  refreshData(): void {
    this.loadData();
  }

  setActiveTab(tab: 'donors' | 'banks'): void {
    this.activeTab = tab;
  }

  // Helper method to map donor data for display
  getDonorContact(donor: BloodDonor): string {
    return donor.phone || 'N/A';
  }
}
