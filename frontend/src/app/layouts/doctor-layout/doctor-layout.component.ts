import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <!-- Header -->
    <header class="bg-[#1e2756]">
      <div class="container mx-auto px-4">
        <nav>
          <div class="flex h-20 items-center justify-between">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <a [routerLink]="['/doctor/home']" class="text-3xl font-bold tracking-tight cursor-pointer">
                <span class="text-white">CARE</span><span class="text-[#00A3FF]">LINK</span>
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

            <!-- Desktop Navigation Links -->
            <div class="hidden md:flex ml-12 space-x-8">
              <a [routerLink]="['/doctor/home']" class="text-white hover:text-[#00A3FF] px-3 py-2">Home</a>
              <a [routerLink]="['/doctor/dashboard']" class="text-white hover:text-[#00A3FF] px-3 py-2">Dashboard</a>
            </div>

            <!-- Profile Picture with Dropdown (Desktop) -->
            <div class="hidden md:block relative" #profileDropdown>
              <button
                (click)="toggleDropdown($event)"
                class="cursor-pointer focus:outline-none bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-7 h-7 text-[#1e2756]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                *ngIf="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50"
                role="menu"
              >
                <button
                  [routerLink]="['/doctor/profile']"
                  (click)="isDropdownOpen = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Profile
                </button>
                <button
                  (click)="logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
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
                [routerLink]="['/doctor/home']"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium"
                (click)="isMobileMenuOpen = false"
              >
                Home
              </a>
              <a
                [routerLink]="['/doctor/dashboard']"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium"
                (click)="isMobileMenuOpen = false"
              >
                Dashboard
              </a>
              <div class="border-t border-gray-700 pt-4">
                <div class="flex items-center px-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-white p-2">
                      <svg class="w-full h-full text-[#1e2756]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-base font-medium text-white">Doctor</div>
                  </div>
                </div>
                <div class="mt-3 px-2 space-y-1">
                  <button
                    [routerLink]="['/doctor/profile']"
                    class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#00A3FF]"
                    (click)="isMobileMenuOpen = false"
                  >
                    Profile
                  </button>
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
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-[calc(100vh-5rem-16rem)]">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1e2756] text-white py-16">
      <div class="container mx-auto px-4">
        <!-- Upper Footer -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Company Info -->
          <div>
            <div class="text-2xl font-bold tracking-tight mb-4">
              <span class="text-white">CARE</span><span class="text-[#00A3FF]">LINK</span>
            </div>
            <p class="text-sm text-gray-300 mb-4">
              Leading the way in Medical<br />
              Excellence. Trusted Care.
            </p>
          </div>

          <!-- Important Links -->
          <div>
            <h3 class="text-lg font-bold mb-4">Important Links</h3>
            <ul class="space-y-2">
              <li><a [routerLink]="['/doctor/home']" class="text-gray-300 hover:text-white cursor-pointer">Home</a></li>
              <li><a [routerLink]="['/doctor/dashboard']" class="text-gray-300 hover:text-white cursor-pointer">Dashboard</a></li>
            </ul>
          </div>

          <!-- Contact Us -->
          <div>
            <h3 class="text-lg font-bold mb-4">Contact Us</h3>
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>Call: (237) 681-812-255</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>Email: info&#64;carelink.com</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Address: 0123 Some place</span>
              </li>
            </ul>
          </div>


        </div>

        <!-- Bottom Footer -->
        <div class="pt-8 border-t border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm text-gray-300">
              &copy; 2025 CareLink. All rights reserved.
            </p>
            <div class="flex gap-4 mt-4 md:mt-0">
              <a class="text-gray-300 hover:text-white cursor-pointer">Privacy Policy</a>
              <a class="text-gray-300 hover:text-white cursor-pointer">Terms of Service</a>
              <a class="text-gray-300 hover:text-white cursor-pointer">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class DoctorLayoutComponent {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (!this.elementRef.nativeElement.querySelector('#profileDropdown')?.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.isDropdownOpen = false;
        this.isMobileMenuOpen = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Even if the backend logout fails, we'll clear local state and redirect
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.isDropdownOpen = false;
        this.isMobileMenuOpen = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
