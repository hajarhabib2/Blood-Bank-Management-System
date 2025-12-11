import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isSubmitting = false;
  loginError: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    console.log('Login button clicked'); // 🔹 تأكيد أن الزر يعمل

    if (this.loginForm.invalid || this.isSubmitting) {
      console.log('Form invalid or submitting');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;
    console.log('Submitting with:', email, password);

    try {
      const user = await this.authService.login(email, password);
      console.log('User from login:', user);

      if (!user) {
        this.loginError = 'Invalid email or password.';
        return;
      }

      // 2) جلب بيانات البروفايل باستخدام userId
      const profile = await this.authService.getRecipientProfileByUserId(user.id);
      console.log('Profile fetched:', profile);

      if (!profile) {
        this.loginError = 'Profile not found for this user.';
        return;
      }

      const fullUserData = { ...user, ...profile };
      console.log('Full user data:', fullUserData);

      localStorage.setItem('currentUser', JSON.stringify(fullUserData));

      // 🔹 توجيه حسب role
      if (user.role === 'recipient') {
        console.log('Navigating to /blood-request');
        await this.router.navigate(['/blood-request']);
      } else {
        console.log('Navigating to /dashboard');
        await this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.loginError = 'Server error. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
