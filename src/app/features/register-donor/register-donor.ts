import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';

@Component({
  selector: 'donor',
  standalone: true,
  imports: [AppForm],
  templateUrl: './register-donor.html',
  styleUrls: ['./register-donor.css'],
})
export class RegisterDonor {
  donorFields = [
    {
      name: 'firstName',
      label: 'Full Name',
      placeholder: '',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Full name is required' }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
      errors: [
        { type: 'required', msg: 'Email required' },
        { type: 'email', msg: 'Invalid Email' },
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
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Phone is required' }],
    },

    {
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Enter age (18-65)',
      validators: [Validators.required, Validators.min(18), Validators.max(65)],
      errors: [
        { type: 'required', msg: 'Age is required' },
        { type: 'min', msg: 'Age must be at least 18' },
        { type: 'max', msg: 'Age must be at most 65' },
      ],
    },
    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      placeholder: 'Blood Group',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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

  onSubmit(val: any) {
    console.log('DONOR DATA:', val);
  }
}
