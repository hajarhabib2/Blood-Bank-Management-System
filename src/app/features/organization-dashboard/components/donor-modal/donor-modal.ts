import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-donation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './donor-modal.html',
  styleUrls: ['./donor-modal.css']
})
export class DonationModalComponent {
  @Input() show = false;
  @Input() donationForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.donationForm.valid) {
      this.save.emit();
    }
  }
}

