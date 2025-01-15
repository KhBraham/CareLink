import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService, Patient as ServicePatient } from '../../../core/services/patient.service';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

interface NewPatient {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history?: string;
}

interface Patient {
  id: number;
  user: {
    name: string;
    email: string;
  };
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history?: string;
}

interface PaginatedResponse {
  current_page: number;
  data: Patient[];
  total: number;
  per_page: number;
  last_page: number;
}

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Manage Patients</h1>

      <!-- Add Patient Form -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New Patient</h2>
        <form (ngSubmit)="addPatient()" #patientForm="ngForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div class="form-field">
              <label for="firstName" class="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="newPatient.firstName"
                required
                class="form-input"
                placeholder="Enter patient's first name"
              >
            </div>

            <!-- Last Name -->
            <div class="form-field">
              <label for="lastName" class="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="newPatient.lastName"
                required
                class="form-input"
                placeholder="Enter patient's last name"
              >
            </div>

            <!-- Email -->
            <div class="form-field">
              <label for="email" class="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="newPatient.email"
                required
                class="form-input"
                placeholder="Enter patient's email"
              >
            </div>

            <!-- Password -->
            <div class="form-field">
              <label for="password" class="form-label">
                Password
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="newPatient.password"
                  required
                  minlength="8"
                  class="form-input"
                  placeholder="Enter patient's password"
                >
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-sm text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <!-- Date of Birth -->
            <div class="form-field">
              <label for="dateOfBirth" class="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                [(ngModel)]="newPatient.date_of_birth"
                required
                class="form-input"
              >
            </div>

            <!-- Gender -->
            <div class="form-field">
              <label for="gender" class="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                [(ngModel)]="newPatient.gender"
                required
                class="form-input"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Phone Number -->
            <div class="form-field">
              <label for="phoneNumber" class="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                [(ngModel)]="newPatient.phone_number"
                required
                class="form-input"
                placeholder="Enter patient's phone number"
              >
            </div>

            <!-- Address -->
            <div class="form-field">
              <label for="address" class="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                [(ngModel)]="newPatient.address"
                required
                class="form-input"
                placeholder="Enter complete address"
              >
            </div>

            <!-- Emergency Contact Name -->
            <div class="form-field">
              <label for="emergencyContactName" class="form-label">
                Emergency Contact Name
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                [(ngModel)]="newPatient.emergency_contact_name"
                required
                class="form-input"
                placeholder="Enter emergency contact name"
              >
            </div>

            <!-- Emergency Contact Phone -->
            <div class="form-field">
              <label for="emergencyContactPhone" class="form-label">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                [(ngModel)]="newPatient.emergency_contact_phone"
                required
                class="form-input"
                placeholder="Enter emergency contact phone"
              >
            </div>
          </div>

          <!-- Medical History -->
          <div class="form-field">
            <label for="medicalHistory" class="form-label">
              Medical History
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              [(ngModel)]="newPatient.medical_history"
              rows="3"
              class="form-input"
              placeholder="Enter patient's medical history (optional)"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              [disabled]="!patientForm.valid || isSubmitting"
              class="form-button"
            >
              <span *ngIf="!isSubmitting">Add Patient</span>
              <span *ngIf="isSubmitting">Adding Patient...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Patient List -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Patient List</h2>
          <div class="relative w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch($event)"
              placeholder="Search patients..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2756]"
            >
            <div class="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-left">Gender</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let patient of patients" class="border-b hover:bg-gray-50">
                <td class="px-4 py-2">{{patient.user.name}}</td>
                <td class="px-4 py-2">{{patient.user.email}}</td>
                <td class="px-4 py-2">{{patient.phone_number}}</td>
                <td class="px-4 py-2">{{patient.gender}}</td>
                <td class="px-4 py-2 space-x-2">
                  <button 
                    (click)="editPatient(patient.id)" 
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </button>
                  <button 
                    (click)="showDeleteModal(patient)" 
                    class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="patients.length === 0">
                <td colspan="5" class="px-4 py-2 text-center text-gray-500">No patients found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4" *ngIf="totalItems > 0">
          <div class="text-sm text-gray-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} patients
          </div>
          <div class="flex space-x-2">
            <button
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
              class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="changePage(page)"
              [class.bg-[#1e2756]]="page === currentPage"
              [class.text-white]="page === currentPage"
              class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              {{ page }}
            </button>
            <button
              [disabled]="currentPage === totalPages"
              (click)="changePage(currentPage + 1)"
              class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteConfirmation" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Patient</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete {{ patientToDelete?.user?.name }}? This action cannot be undone.
            </p>
          </div>
          <div class="flex justify-center gap-4 mt-4">
            <button 
              (click)="hideDeleteModal()"
              class="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Cancel
            </button>
            <button 
              (click)="confirmDelete()"
              [disabled]="isDeleting"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .form-field {
      @apply mb-4;
    }

    .form-label {
      @apply block text-sm font-medium text-gray-700 mb-1;
    }

    .form-input {
      @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e2756];
    }

    .form-button {
      @apply bg-[#1e2756] text-white px-6 py-2 rounded-md hover:bg-[#2a3572] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }
  `]
})
export class ManagePatientsComponent implements OnInit {
  showPassword = false;
  isSubmitting = false;
  patients: Patient[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;
  private searchSubject = new Subject<string>();
  protected readonly Math = Math;

  newPatient: NewPatient = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: 'male',
    phone_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: ''
  };

  // Delete modal properties
  showDeleteConfirmation = false;
  patientToDelete: Patient | null = null;
  isDeleting = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.currentPage = 1;
      this.loadPatients();
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: PaginatedResponse) => {
        this.patients = response.data;
        this.totalItems = response.total;
        this.totalPages = response.last_page;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load patients',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  changePage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPatients();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  addPatient(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    const patientData = {
      name: `${this.newPatient.firstName} ${this.newPatient.lastName}`,
      email: this.newPatient.email,
      password: this.newPatient.password,
      date_of_birth: this.newPatient.date_of_birth,
      gender: this.newPatient.gender,
      phone_number: this.newPatient.phone_number,
      address: this.newPatient.address,
      emergency_contact_name: this.newPatient.emergency_contact_name,
      emergency_contact_phone: this.newPatient.emergency_contact_phone,
      medical_history: this.newPatient.medical_history
    };

    this.patientService.createPatient(patientData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Patient has been added successfully',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1e2756',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        this.loadPatients(); // Reload the patient list
        // Reset form
        this.newPatient = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          date_of_birth: '',
          gender: 'male',
          phone_number: '',
          address: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          medical_history: ''
        };
      },
      error: (error) => {
        console.error('Error adding patient:', error);
        if (error.error?.errors) {
          const errorMessages = Object.values(error.error.errors) as string[];
          errorMessages.forEach(message => {
            this.toastr.error(message);
          });
        } else {
          this.toastr.error('Error adding patient');
        }
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  editPatient(id: number): void {
    this.router.navigate(['/admin/patients/edit', id]);
  }

  showDeleteModal(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteConfirmation = true;
  }

  hideDeleteModal(): void {
    this.showDeleteConfirmation = false;
    this.patientToDelete = null;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    if (!this.patientToDelete || this.isDeleting) return;

    this.isDeleting = true;
    this.patientService.deletePatient(this.patientToDelete.id).subscribe({
      next: () => {
        this.loadPatients();
        this.hideDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting patient:', error);
        this.isDeleting = false;
      }
    });
  }

  validateForm(): boolean {
    const required = [
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'email', label: 'Email' },
      { field: 'password', label: 'Password' },
      { field: 'date_of_birth', label: 'Date of Birth' },
      { field: 'gender', label: 'Gender' },
      { field: 'phone_number', label: 'Phone Number' },
      { field: 'address', label: 'Address' },
      { field: 'emergency_contact_name', label: 'Emergency Contact Name' },
      { field: 'emergency_contact_phone', label: 'Emergency Contact Phone' }
    ];

    for (const item of required) {
      if (!this.newPatient[item.field as keyof typeof this.newPatient]) {
        this.toastr.error(`${item.label} is required`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newPatient.email)) {
      this.toastr.error('Please enter a valid email address');
      return false;
    }

    // Validate password length
    if (this.newPatient.password.length < 8) {
      this.toastr.error('Password must be at least 8 characters long');
      return false;
    }

    return true;
  }
}
