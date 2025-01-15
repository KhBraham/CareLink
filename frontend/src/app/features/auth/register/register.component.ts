import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterPatientRequest } from '../../../core/interfaces/register-patient-request.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="h-screen flex">
      <!-- Left side - Image -->
      <div class="hidden lg:block lg:w-1/2">
        <img src="assets/images/login.jpg" alt="Medical Team" class="w-full h-full object-cover">
      </div>

      <!-- Right side - Registration Form -->
      <div class="w-full lg:w-1/2 flex flex-col  px-8 lg:px-16 py-8 overflow-y-auto">
        <div class="max-w-md w-full mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-[#1e2756] mb-2">Create Account</h1>
            <p class="text-gray-600">Join <a routerLink="/">CARELINK</a> for better healthcare management</p>
          </div>

          <div class="space-y-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-[#1e2756]">Personal Information</h2>

              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="formData.name" name="name"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter your full name">
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" [(ngModel)]="formData.email" name="email"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter your email">
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div class="relative">
                  <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="formData.password" name="password"
                         class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                         placeholder="Create a password">
                  <button (click)="togglePassword('password')" type="button"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div class="relative">
                  <input [type]="showConfirmPassword ? 'text' : 'password'" [(ngModel)]="formData.password_confirmation" name="password_confirmation"
                         class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                         placeholder="Confirm your password">
                  <button (click)="togglePassword('confirm')" type="button"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path *ngIf="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      <path *ngIf="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-[#1e2756]">Additional Information</h2>

              <!-- Date of Birth -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" [(ngModel)]="formData.date_of_birth" name="date_of_birth"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]">
              </div>

              <!-- Gender -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select [(ngModel)]="formData.gender" name="gender"
                        class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" [(ngModel)]="formData.phone_number" name="phone_number"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter your phone number">
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea [(ngModel)]="formData.address" name="address" rows="2"
                          class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                          placeholder="Enter your address"></textarea>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-[#1e2756]">Emergency Contact</h2>

              <!-- Emergency Contact Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                <input type="text" [(ngModel)]="formData.emergency_contact_name" name="emergency_contact_name"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter emergency contact name">
              </div>

              <!-- Emergency Contact Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                <input type="tel" [(ngModel)]="formData.emergency_contact_phone" name="emergency_contact_phone"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter emergency contact phone">
              </div>
            </div>

            <!-- Medical History -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Medical History (Optional)</label>
              <textarea [(ngModel)]="formData.medical_history" name="medical_history" rows="3"
                        class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                        placeholder="Enter any relevant medical history"></textarea>
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="text-red-500 text-sm text-center">
              {{ error }}
            </div>

            <!-- Register Button -->
            <button (click)="register()"
                    class="w-full bg-[#1e2756] text-white py-2 px-4 rounded-md hover:bg-[#1e2756]/90 transition-colors">
              Create Account
            </button>

            <div class="text-center mt-4">
              <p class="text-gray-600">
                Already have an account?
                <a routerLink="/login" class="text-[#00A3FF] hover:underline">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class RegisterComponent {
  formData: RegisterPatientRequest = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    date_of_birth: '',
    gender: 'male',
    phone_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  error?: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async register() {
    try {
      // Validate required fields
      if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.password_confirmation) {
        this.error = 'Please fill in all required fields';
        return;
      }

      // Validate password match
      if (this.formData.password !== this.formData.password_confirmation) {
        this.error = 'Passwords do not match';
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.error = 'Please enter a valid email address';
        return;
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(this.formData.phone_number)) {
        this.error = 'Please enter a valid phone number';
        return;
      }

      const response = await this.authService.register(this.formData).toPromise();
      console.log('Registration successful:', response);

      // Redirect to patient home
      this.router.navigate(['/patient/home']);
    } catch (error: any) {
      console.error('Registration failed:', error);
      this.error = error.error?.message || 'Registration failed. Please try again.';
    }
  }
}
