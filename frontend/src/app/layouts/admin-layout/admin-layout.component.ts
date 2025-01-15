import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-[#1e2756] shadow-sm">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <a href="/admin/dashboard" class="text-white font-bold text-xl">
                <span class="text-white">CARE</span>
                <span class="text-[#00A3FF]">LINK</span>
              </a>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button 
                (click)="isMobileMenuOpen = !isMobileMenuOpen"
                class="text-white hover:text-[#00A3FF] focus:outline-none"
              >
                <svg 
                  class="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    *ngIf="!isMobileMenuOpen" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path 
                    *ngIf="isMobileMenuOpen" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-4">
              <a routerLink="/admin/dashboard" 
                 routerLinkActive="text-[#00A3FF]"
                 class="text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-sm transition-colors">
                Dashboard
              </a>
              <a routerLink="/admin/doctors" 
                 routerLinkActive="text-[#00A3FF]"
                 class="text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-sm transition-colors">
                Manage Doctors
              </a>
              <a routerLink="/admin/patients" 
                 routerLinkActive="text-[#00A3FF]"
                 class="text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-sm transition-colors">
                Manage Patients
              </a>
            </nav>

            <!-- Admin Profile -->
            <div class="hidden md:flex items-center">
              <div class="flex items-center space-x-3">
                <span class="text-sm text-white">Admin</span>
                <div class="relative">
                  <button 
                    (click)="isDropdownOpen = !isDropdownOpen"
                    class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A3FF]"
                  >
                    <img
                      class="h-8 w-8 rounded-full bg-gray-200"
                      src="/assets/images/profile-icon.png"
                      alt="Admin profile"
                    />
                  </button>
                  <!-- Dropdown menu -->
                  <div
                    *ngIf="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="py-1">
                      <button
                        (click)="logout()"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile menu -->
          <div
            *ngIf="isMobileMenuOpen"
            class="md:hidden"
          >
            <div class="px-2 pt-2 pb-3 space-y-1">
              <a
                routerLink="/admin/dashboard"
                routerLinkActive="text-[#00A3FF]"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium"
                (click)="isMobileMenuOpen = false"
              >
                Dashboard
              </a>
              <a
                routerLink="/admin/doctors"
                routerLinkActive="text-[#00A3FF]"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium"
                (click)="isMobileMenuOpen = false"
              >
                Manage Doctors
              </a>
              <a
                routerLink="/admin/patients"
                routerLinkActive="text-[#00A3FF]"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium"
                (click)="isMobileMenuOpen = false"
              >
                Manage Patients
              </a>
              <div class="border-t border-gray-700 pt-4">
                <div class="flex items-center px-3">
                  <div class="flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-full bg-gray-100"
                      src="/assets/images/profile-icon.png"
                      alt="Admin profile"
                    />
                  </div>
                  <div class="ml-3">
                    <div class="text-base font-medium text-white">Admin</div>
                  </div>
                </div>
                <div class="mt-3 px-2">
                  <button
                    (click)="logout()"
                    class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#00A3FF]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Even if the API call fails, we should still clear local data and redirect
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}