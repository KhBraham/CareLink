import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="bg-[#1e2756] py-4">
        <nav class="container mx-auto px-4">
          <div class="flex justify-between items-center">
            <a routerLink="/" class="text-3xl font-bold tracking-tight">
              <span class="text-white">CARE</span><span class="text-[#00A3FF]">LINK</span>
            </a>

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
            <div class="hidden md:flex gap-4">
              <a routerLink="/register" class="bg-[#8C98C9] hover:bg-[#7A87BC] text-white px-6 py-2 rounded-full font-medium cursor-pointer">SignUp</a>
              <a routerLink="/login" class="bg-[#C7D7FF] hover:bg-[#B6C9FF] text-[#1e2756] px-6 py-2 rounded-full font-medium cursor-pointer">Login</a>
            </div>
          </div>

          <!-- Mobile menu -->
          <div
            *ngIf="isMobileMenuOpen"
            class="md:hidden mt-4"
          >
            <div class="flex flex-col gap-2">
              <a
                routerLink="/register"
                class="block text-white hover:text-[#00A3FF] px-3 py-2 rounded-md text-base font-medium text-center bg-[#8C98C9] hover:bg-[#7A87BC]"
                (click)="isMobileMenuOpen = false"
              >
                SignUp
              </a>
              <a
                routerLink="/login"
                class="block text-[#1e2756] hover:text-[#1e2756] px-3 py-2 rounded-md text-base font-medium text-center bg-[#C7D7FF] hover:bg-[#B6C9FF]"
                (click)="isMobileMenuOpen = false"
              >
                Login
              </a>
            </div>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="flex-1">
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
                <li><a routerLink="/login" class="text-gray-300 hover:text-white cursor-pointer">Appointment</a></li>
                <li><a routerLink="/login" class="text-gray-300 hover:text-white cursor-pointer">Doctors</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div>
              <h3 class="text-lg font-bold mb-4">Contact Info</h3>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#00A3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Phone: (123) 456-7890</span>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>Address: 0123 Some place</span>
                </li>
              </ul>
            </div>

            <!-- Working Hours -->
            <div>
              <h3 class="text-lg font-bold mb-4">Working Hours</h3>
              <ul class="space-y-2">
                <li>Mon - Wed: 9:00 AM - 7:00 PM</li>
                <li>Thursday: 9:00 AM - 6:30 PM</li>
                <li>Friday: 9:00 AM - 6:00 PM</li>
                <li>Sun - Sat: Closed</li>
              </ul>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="border-t border-gray-700 pt-8">
            <p class="text-center text-gray-400">
              &copy; 2025 CareLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class DefaultLayoutComponent {
  isMobileMenuOpen = false;
}
