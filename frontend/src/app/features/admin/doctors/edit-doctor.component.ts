import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService, Doctor, DoctorFormData } from '../../../core/services/doctor.service';
import { ToastrService } from 'ngx-toastr';

interface EditableDoctor {
  specialization: string;
  qualifications: string;
  phone_number: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-[#1e2756] mb-2">Edit Doctor</h1>
        <p class="text-gray-600">Update doctor information</p>
      </div>

      <!-- Current Info Card -->
      <div class="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-[#1e2756] mb-4">Current Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Name</p>
            <p class="font-medium">{{ originalDoctor.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ originalDoctor.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Specialization</p>
            <p class="font-medium">{{ originalDoctor.specialization }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Qualifications</p>
            <p class="font-medium">{{ originalDoctor.qualifications }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Phone Number</p>
            <p class="font-medium">{{ originalDoctor.phone_number }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Update Information</h2>
        <form (ngSubmit)="updateDoctor()" #doctorForm="ngForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Specialization -->
            <div>
              <label for="specialization" class="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                [(ngModel)]="editedDoctor.specialization"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                placeholder="Enter doctor's specialization"
              >
            </div>

            <!-- Qualifications -->
            <div>
              <label for="qualifications" class="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                id="qualifications"
                name="qualifications"
                [(ngModel)]="editedDoctor.qualifications"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                placeholder="Enter doctor's qualifications"
              >
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phone_number" class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                [(ngModel)]="editedDoctor.phone_number"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                placeholder="Enter doctor's phone number"
              >
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="editedDoctor.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                [placeholder]="originalDoctor.email"
              >
              <p class="text-sm text-gray-500 mt-1">Current email: {{ originalDoctor.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="editedDoctor.password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                placeholder="Leave empty to keep current password"
              >
            </div>

            <!-- Confirm Password -->
            <div *ngIf="editedDoctor.password">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="editedDoctor.confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
                placeholder="Confirm new password"
              >
              <div *ngIf="passwordMismatch" class="text-red-500 text-sm mt-1">
                Passwords do not match
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              (click)="goBack()"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!doctorForm.form.valid || passwordMismatch"
              class="px-4 py-2 text-white bg-[#1e2756] rounded-md hover:bg-[#161d40] focus:outline-none focus:ring-2 focus:ring-[#1e2756] disabled:opacity-50"
            >
              Update Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditDoctorComponent implements OnInit {
  originalDoctor: Doctor = {
    id: 0,
    name: '',
    email: '',
    specialization: '',
    qualifications: '',
    phone_number: ''
  };

  editedDoctor: EditableDoctor = {
    specialization: '',
    qualifications: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordMismatch = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.doctorService.getDoctor(+id).subscribe({
        next: (doctor) => {
          this.originalDoctor = doctor;
          // Initialize the edited doctor with current values
          this.editedDoctor = {
            specialization: doctor.specialization,
            qualifications: doctor.qualifications,
            phone_number: doctor.phone_number,
            email: doctor.email,
            password: '',
            confirmPassword: ''
          };
        },
        error: (error) => {
          console.error('Error loading doctor:', error);
          this.toastr.error('Error loading doctor details', 'Error');
          this.goBack();
        }
      });
    } else {
      this.toastr.error('No doctor ID provided', 'Error');
      this.goBack();
    }
  }

  updateDoctor() {
    if (!this.originalDoctor.id) {
      this.toastr.error('No doctor ID available', 'Error');
      return;
    }

    // Check if password fields match if a new password is being set
    if (this.editedDoctor.password) {
      if (this.editedDoctor.password !== this.editedDoctor.confirmPassword) {
        this.passwordMismatch = true;
        this.toastr.error('Passwords do not match', 'Error');
        return;
      }
      this.passwordMismatch = false;
    }

    const updateData: Partial<DoctorFormData> = {
      specialization: this.editedDoctor.specialization,
      qualifications: this.editedDoctor.qualifications,
      phoneNumber: this.editedDoctor.phone_number
    };

    // Only include email if it's been changed and is not empty
    if (this.editedDoctor.email && this.editedDoctor.email !== this.originalDoctor.email) {
      updateData.email = this.editedDoctor.email;
    }

    // Only include password if it's been provided and is not empty
    if (this.editedDoctor.password && this.editedDoctor.password.trim()) {
      updateData.password = this.editedDoctor.password;
    }

    this.doctorService.updateDoctor(this.originalDoctor.id, updateData).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Doctor updated successfully', 'Success');
        
        // Update the original doctor data with the response
        this.originalDoctor = response.doctor;
        
        // Reset password fields
        this.editedDoctor.password = '';
        this.editedDoctor.confirmPassword = '';
        
        // Navigate back after a short delay to show the success message
        setTimeout(() => this.goBack(), 1500);
      },
      error: (error) => {
        console.error('Error updating doctor:', error);
        this.toastr.error(error.error?.error || 'Error updating doctor', 'Error');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/doctors']);
  }
}
