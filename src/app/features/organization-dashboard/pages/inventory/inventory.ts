import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventorySummary } from '../../../../core/models/inventory.model';
import { BloodType } from '../../../../core/models/blood-request.model';
import { BloodUnit } from '../../../../core/models/blood-unit.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class InventoryComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;
  @Input() organizationId!: string;
  @Output() statsChange = new EventEmitter<{
    totalAvailableUnits: number;
    unitsExpiringSoon: number;
  }>();

  inventorySummary: InventorySummary[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    void this.loadInventory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      void this.loadInventory();
    }
  }

  private async loadInventory(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const res = await this.inventoryService.getAll();
      const units: BloodUnit[] = (res?.data ?? []).filter(
        (unit: BloodUnit) => unit.organizationId === this.organizationId
      );
      this.inventorySummary = this.computeInventorySummary(units);
      this.emitStats();
    } catch (err: any) {
      this.inventorySummary = [];
      this.error = err?.message ?? 'Failed to load inventory';
      this.emitStats();
    } finally {
      this.isLoading = false;
    }
  }

  private emitStats(): void {
    const totalAvailableUnits = this.inventorySummary.reduce(
      (sum, summary) => sum + summary.availableUnits,
      0
    );
    const unitsExpiringSoon = this.inventorySummary.reduce(
      (sum, summary) => sum + summary.expiringSoon,
      0
    );

    this.statsChange.emit({ totalAvailableUnits, unitsExpiringSoon });
  }

  private computeInventorySummary(units: BloodUnit[]): InventorySummary[] {
    const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return bloodTypes.map((bt) => {
      const typeUnits = units.filter((u) => u.bloodType === bt);

      const expiringSoon = typeUnits.filter((u) => {
        const expiry = new Date(u.expiryDate);
        return expiry <= sevenDaysFromNow && expiry > now && u.status !== 'expired';
      }).length;

      const expiryDates = typeUnits
        .filter((u: any) => u.status === 'available' || u.status === 'reserved')
        .map((u: any) => new Date(u.expiryDate))
        .filter((d: any) => d > now)
        .sort((a: any, b: any) => a.getTime() - b.getTime());

      return {
        bloodType: bt,
        totalUnits: typeUnits.length,
        availableUnits: typeUnits.filter((u: any) => u.status === 'available').length,
        reservedUnits: typeUnits.filter((u: any) => u.status === 'reserved').length,
        expiredUnits: typeUnits.filter((u: any) => u.status === 'expired').length,
        expiringSoon,
        earliestExpiry: expiryDates.length > 0 ? expiryDates[0].toISOString() : undefined,
      };
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}

