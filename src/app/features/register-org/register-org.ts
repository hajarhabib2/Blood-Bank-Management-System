import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';

@Component({
  selector: 'register-org',
  standalone: true,
  imports: [AppForm],
  templateUrl: './register-org.html',
  styleUrls: ['./register-org.css'],
})
export class RegisterOrg {
  orgFields = [
    {
      name: 'orgName',
      label: 'Organization Name',
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
        { type: 'required', msg: 'Email required' },
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
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Phone required' }],
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
      name: 'address',
      label: 'Address',
      type: 'textarea',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
  ];

  onSubmit(val: any) {
    console.log('ORGANIZATION:', val);
  }
}
