import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-request-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-modal.html',
  styleUrls: ['./request-modal.css']
})
export class RequestModalComponent {
  @Input() show = false;
  @Input() requestForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.requestForm.valid) {
      this.save.emit();
    }
  }
}

