import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { PatientProfile } from './profile.types';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-[#1e2756] text-center mb-12">My Information</h1>

      <ng-container *ngIf="profile; else loading">
        <div class="max-w-3xl mx-auto">
          <!-- Name and Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Name</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.user.name }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Email</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.user.email }}
              </div>
            </div>
          </div>

          <!-- Date of Birth and Gender -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Date of Birth</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.date_of_birth | date:'mediumDate' }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Gender</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.gender | titlecase }}
              </div>
            </div>
          </div>

          <!-- Phone and Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Phone Number</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.phone_number }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Address</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200 whitespace-pre-wrap">
                {{ profile.address }}
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Emergency Contact Name</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.emergency_contact_name }}
              </div>
            </div>
            <div>
              <label class="block text-[#1e2756] text-lg mb-2">Emergency Contact Phone</label>
              <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200">
                {{ profile.emergency_contact_phone }}
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="mb-6">
            <label class="block text-[#1e2756] text-lg mb-2">Medical History</label>
            <div class="w-full px-4 py-3 rounded-lg bg-[#F8F9FC] border border-gray-200 whitespace-pre-wrap">
              {{ profile.medical_history || 'No medical history available' }}
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #loading>
        <div class="text-center">
          <div *ngIf="!error" class="text-gray-500">
            Loading profile information...
          </div>
          <div *ngIf="error" class="text-red-500 mt-4">
            {{ error }}
          </div>
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
  profile?: PatientProfile;
  error?: string;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    console.log('Current user:', user);
    
    if (user?.profile?.patientId) {
      this.loadProfile(user.profile.patientId);
    } else {
      this.error = 'Could not find patient information. Please make sure you are logged in as a patient.';
      console.error('No patient ID found in user profile:', user);
    }
  }

  private loadProfile(patientId: number) {
    console.log('Loading profile for patient ID:', patientId);
    this.profileService.getPatientProfile(patientId).subscribe({
      next: (profile) => {
        console.log('Received profile data:', profile);
        if (!profile) {
          this.error = 'No profile data received from the server.';
          return;
        }
        this.profile = profile;
        this.error = undefined;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load profile information. Please try again later.';
      }
    });
  }
}