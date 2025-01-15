import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { DoctorProfile } from './profile.types';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-[#1e2756] text-center mb-12">Doctor Profile</h1>

      <ng-container *ngIf="profile; else loading">
        <div class="max-w-3xl mx-auto">
          <!-- Name -->
          <div class="mb-6">
            <label class="block text-[#1e2756] text-lg mb-2">Name</label>
            <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
              {{ profile.name }}
            </div>
          </div>

          <!-- Professional Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Specialization</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.specialization }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Qualifications</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.qualifications }}
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Email</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.email }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Phone Number</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.phone_number }}
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #loading>
        <div class="text-center text-gray-500">
          Loading profile information...
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile?: DoctorProfile;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.profile?.doctorId) {
      this.loadProfile(user.profile.doctorId);
    }
  }

  private loadProfile(doctorId: number) {
    this.profileService.getDoctorProfile(doctorId).subscribe({
      next: (profile: DoctorProfile) => {
        this.profile = profile;
        console.log('Loaded doctor profile:', profile);
      },
      error: (error: any) => {
        console.error('Error loading doctor profile:', error);
      }
    });
  }
}