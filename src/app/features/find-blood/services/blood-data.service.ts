import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface BloodDonor {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodType?: string;
  eligibilityStatus: string;
  status: string;
  lastDonationDate?: string;
  totalDonations?: number;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  contact: string;
  branches?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BloodDataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDonors(): Observable<BloodDonor[]> {
    return this.http
      .get<BloodDonor[]>(`${this.apiUrl}/donors`)
      .pipe(map((donors) => donors.filter((donor) => donor.eligibilityStatus === 'eligible')));
  }

  getBloodBanks(): Observable<BloodBank[]> {
    return this.http.get<BloodBank[]>(`${this.apiUrl}/bloodBanks`);
  }

  getOrganizations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/organizations`);
  }
}
