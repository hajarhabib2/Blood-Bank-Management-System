import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css'],
})
export class ForgetPassword implements OnInit {
  forgetPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      console.log('Reset password request:', this.forgetPasswordForm.value);
      // ⬅️ Here you would add API call to send reset password email
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.forgetPasswordForm.markAllAsTouched();
    }
  }

  get f() {
    return this.forgetPasswordForm.controls;
  }
}

