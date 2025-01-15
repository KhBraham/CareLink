import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#1e2756] py-4">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold">
              <span class="text-white">CARE</span><span class="text-[#00A3FF]">LINK</span>
            </a>
          </div>
          
          <!-- Navigation Links Based on Role -->
          <div class="flex items-center space-x-6" *ngIf="currentUser">
            <ng-container [ngSwitch]="currentUser.role">
              <!-- Patient Navigation -->
              <ng-container *ngSwitchCase="'patient'">
                <a routerLink="/patient/appointments" class="text-white hover:text-[#C7D7FF]">My Appointments</a>
                <a routerLink="/patient/medical-records" class="text-white hover:text-[#C7D7FF]">Medical Records</a>
              </ng-container>
              
              <!-- Doctor Navigation -->
              <ng-container *ngSwitchCase="'doctor'">
                <a routerLink="/doctor/appointments" class="text-white hover:text-[#C7D7FF]">Appointments</a>
                <a routerLink="/doctor/patients" class="text-white hover:text-[#C7D7FF]">Patients</a>
              </ng-container>
              
              <!-- Admin Navigation -->
              <ng-container *ngSwitchCase="'admin'">
                <a routerLink="/admin/doctors" class="text-white hover:text-[#C7D7FF]">Manage Doctors</a>
                <a routerLink="/admin/patients" class="text-white hover:text-[#C7D7FF]">Manage Patients</a>
              </ng-container>
            </ng-container>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="!currentUser">
              <a routerLink="/auth/register" class="bg-[#6B7280] text-white px-6 py-2 rounded-md hover:bg-[#6B7280]/90">Sign Up</a>
              <a routerLink="/auth/login" class="bg-[#C7D7FF] text-[#1e2756] px-6 py-2 rounded-md hover:bg-[#C7D7FF]/90">Log In</a>
            </ng-container>
            
            <ng-container *ngIf="currentUser">
              <div class="flex items-center space-x-4">
                <span class="text-white">{{ currentUser.name }}</span>
                <button (click)="logout()" 
                        class="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
                  Log Out
                </button>
              </div>
            </ng-container>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
