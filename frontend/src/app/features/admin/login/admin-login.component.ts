import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginCredentials } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full mx-4">
        <div class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-[#1e2756] mb-2">Admin Login</h1>
            <p class="text-gray-600">Please enter your credentials</p>
          </div>

          <div class="space-y-6">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="credentials.email" name="email"
                     class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                     placeholder="Enter your email">
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="credentials.password" name="password"
                       class="w-full px-3 py-2 bg-[#F3F4F6] border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                       placeholder="Enter password">
                <button (click)="togglePassword()" type="button"
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

            <!-- Error Message -->
            <div *ngIf="error" class="text-red-500 text-sm text-center">
              {{ error }}
            </div>

            <button (click)="login()"
                    class="w-full bg-[#1e2756] text-white py-2 px-4 rounded-md hover:bg-[#1e2756]/90 transition-colors">
              Sign in
            </button>

            <div class="text-center mt-4">
              <a routerLink="/login" class="text-[#00A3FF] hover:underline">Back to main login</a>
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
export class AdminLoginComponent implements OnInit {
  credentials: LoginCredentials = {
    email: '',
    password: '',
    role: 'admin'
  };

  showPassword = false;
  error?: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if already logged in as admin
    if (this.authService.isAuthenticated() && this.authService.getCurrentUserRole() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    try {
      await this.authService.adminLogin(this.credentials).toPromise();
      this.router.navigate(['/admin/dashboard']);
    } catch (error: any) {
      console.error('Admin login failed:', error);
      this.error = error.error?.message || 'Invalid admin credentials';
    }
  }
}
