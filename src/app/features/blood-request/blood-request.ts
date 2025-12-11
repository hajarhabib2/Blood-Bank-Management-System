import { Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';
import { BloodRequestService, BloodRequestPayload } from './services/blood-request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'blood-request',
  standalone: true,
  imports: [AppForm],
  templateUrl: './blood-request.html',
  styleUrls: ['./blood-request.css'],
})
export class BloodRequest {
  private bloodRequestService = inject(BloodRequestService);
  private router = inject(Router);
  currentUser: any = null;

  isSubmitting = false;
  submissionMessage: 'success' | 'failure' | null = null;
  private currentUserId = 'USR-rmqm8r';

  requestFields = [
    {
      name: 'unitsNeeded',
      label: 'Units Needed (max is 6 units)',
      type: 'number',
      min: 1,
      max: 6,
      validators: [Validators.required, Validators.min(1), Validators.max(6)],
      errors: [
        { type: 'required', msg: 'Required' },
        { type: 'min', msg: 'Units must be greater than 0' },
        { type: 'max', msg: 'maximum units is 6' },
      ],
    },
    {
      name: 'requestReason',
      label: 'Reason for Request',
      type: 'select',
      placeholder: 'Select Reason',
      options: ['Surgery', 'Emergency', 'Critical Condition'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'neededBefore',
      label: 'Needed Before',
      type: 'date',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'medicalReport',
      label: 'Medical Report',
      type: 'file',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Medical report is required' }],
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Additional details (optional)',
      validators: [],
      errors: [],
    },
    {
      name: 'agreeTerms',
      label:
        'I confirm that the information provided is accurate and I agree to be contacted for blood donation purposes.',
      type: 'checkbox',
      validators: [Validators.requiredTrue],
      errors: [{ type: 'required', msg: 'You must agree to the terms' }],
    },
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  async onSubmit(val: any) {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submissionMessage = null; // تنظيف الرسالة قبل كل محاولة

    try {
      const payload: BloodRequestPayload = {
        userId: this.currentUser.userId || this.currentUserId,
        unitsNeeded: val.unitsNeeded,
        requestReason: val.requestReason,
        neededBefore: val.neededBefore,
        notes: val.notes || undefined,
        medicalReport: val.medicalReport || undefined,
      };

      const result = await this.bloodRequestService.submitRequest(payload);
      console.log('✅ Blood Request Submitted Successfully:', result);

      // تعيين الرسالة بعد نجاح الطلب
      this.submissionMessage = 'success';

      // انتظر ثانيتين قبل التنقل للصفحة الرئيسية
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 4000);
    } catch (error) {
      console.error('Failed to submit request:', error);
      this.submissionMessage = 'failure';
      alert('حدث خطأ، حاول مرة أخرى.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
