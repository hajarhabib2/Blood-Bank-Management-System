import { Component, Renderer2, RendererFactory2 } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';
import {
  RecipientService,
  UserPayload,
  RecipientProfilePayload,
} from '../../core/services/recipientService';
import { Router } from '@angular/router';

@Component({
  selector: 'recipient',
  standalone: true,
  imports: [AppForm],
  templateUrl: './register-recipient.html',
  styleUrls: ['./register-recipient.css'],
})
export class RegisterRecipient {
  recipientFields = [
    {
      sectionTitle: '👤 Account and Login',
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
      errors: [
        { type: 'required', msg: 'Required' },
        { type: 'email', msg: 'Invalid email' },
      ],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
      errors: [
        { type: 'required', msg: 'Password required' },
        { type: 'minlength', msg: 'Min 6 chars' },
      ],
      successMessage: 'Valid password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [Validators.required],
      errors: [
        { type: 'required', msg: 'Please confirm password' },
        { type: 'passwordMismatch', msg: 'Passwords do not match' },
      ],
      successMessage: 'Passwords match',
    },
    {
      sectionTitle: '🌎 Contact and Location',
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'governorate',
      label: 'Governorate',
      type: 'select',
      placeholder: 'Select Governorate',
      options: [
        'Cairo',
        'Giza',
        'Alexandria',
        'Dakahlia',
        'Red Sea',
        'Beheira',
        'Fayoum',
        'Gharbia',
        'Ismailia',
        'Menofia',
        'Minya',
        'Qaliubiya',
        'New Valley',
        'Suez',
        'Aswan',
        'Assiut',
        'Beni Suef',
        'Port Said',
        'Damietta',
        'Sharkia',
        'South Sinai',
        'Kafr El Sheikh',
        'Matrouh',
        'Luxor',
        'Qena',
        'North Sinai',
        'Sohag',
      ],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Governorate is required' }],
    },

    {
      name: 'district',
      label: 'District',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'District is required' }],
    },
    {
      sectionTitle: '⚕️ Personal and Health',
      name: 'age',
      label: ' Age',
      type: 'number',
      validators: [Validators.required, Validators.min(0)],
      errors: [{ type: 'required', msg: 'Age is required' }],
    },
    {
      name: 'gender',
      label: ' Gender',
      type: 'select',
      placeholder: 'Select Gender',
      options: ['Male', 'Female'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Gender is required' }],
    },
    {
      name: 'bloodGroup',
      label: ' Blood Group',
      type: 'select',
      placeholder: 'Blood Group',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      sectionTitle: '📄 Verification',
      name: 'idCard',
      label: 'ID Card Image',
      type: 'file',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'ID Card image is required' }],
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
  private renderer: Renderer2;
  constructor(
    private recipientService: RecipientService,
    private router: Router,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  isSubmitting = false;

  async onSubmit(combinedData: any) {
    if (this.isSubmitting) return;

    if (combinedData.password !== combinedData.confirmPassword) {
      this.showPopup('Passwords do not match', 'failure');
      return;
    }

    this.isSubmitting = true;

    const userPayload: UserPayload = {
      email: combinedData.email,
      password: combinedData.password,
      role: 'recipient',
    };

    const profilePayload: RecipientProfilePayload = {} as RecipientProfilePayload;
    for (const key in combinedData) {
      if (key !== 'email' && key !== 'password' && key !== 'confirmPassword') {
        (profilePayload as any)[key] = combinedData[key];
      }
    }

    try {
      const result = await this.recipientService.registerRecipientFlow({
        accountInfo: userPayload,
        profile: profilePayload,
      });

      console.log('Registration successful', result);
      this.showPopup('Registration successful', 'success');

      // بعد 2 ثانية التوجيه للصفحة التالية
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.message || error.response?.data?.message || 'Unknown error during registration.';
      console.error('Registration failed:', errorMessage, error);
      this.isSubmitting = false;
      this.showPopup('Registration failed', 'failure', 4000);
    }
  }

  // ---------------- Popup Function ----------------
  showPopup(message: string, type: 'success' | 'failure', duration: number = 2000) {
    const popup = this.renderer.createElement('div');
    this.renderer.setStyle(popup, 'position', 'fixed');
    this.renderer.setStyle(popup, 'top', '20px');
    this.renderer.setStyle(popup, 'left', '50%');
    this.renderer.setStyle(popup, 'transform', 'translateX(-50%)');
    this.renderer.setStyle(popup, 'padding', '12px 24px');
    this.renderer.setStyle(popup, 'color', '#fff');
    this.renderer.setStyle(popup, 'fontWeight', 'bold');
    this.renderer.setStyle(popup, 'borderRadius', '8px');
    this.renderer.setStyle(popup, 'zIndex', '9999');
    this.renderer.setStyle(popup, 'boxShadow', '0 4px 6px rgba(0,0,0,0.2)');
    this.renderer.setStyle(popup, 'transition', 'opacity 0.3s ease');

    if (type === 'success') {
      this.renderer.setStyle(popup, 'backgroundColor', '#16a34a'); // أخضر
    } else {
      this.renderer.setStyle(popup, 'backgroundColor', '#dc2626'); // أحمر
    }

    const text = this.renderer.createText(message);
    this.renderer.appendChild(popup, text);
    this.renderer.appendChild(document.body, popup);

    // إخفاء popup بعد المدة المحددة
    setTimeout(() => {
      this.renderer.setStyle(popup, 'opacity', '0');
      setTimeout(() => {
        this.renderer.removeChild(document.body, popup);
      }, 300); // مدة fade-out
    }, duration);
  }
}
