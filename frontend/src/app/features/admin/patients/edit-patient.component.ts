import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ToastrService } from 'ngx-toastr';

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

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Patient</h1>
        <button 
          (click)="goBack()" 
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to List
        </button>
      </div>

      <!-- Current Patient Information -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Current Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">Name</p>
            <p class="font-medium">{{ patient?.user?.name || 'Loading...' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Email</p>
            <p class="font-medium">{{ patient?.user?.email || 'Loading...' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Date of Birth</p>
            <p class="font-medium">{{ patient?.date_of_birth?.substring(0, 10) || 'Not specified' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Gender</p>
            <p class="font-medium">{{ patient?.gender || 'Not specified' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Phone Number</p>
            <p class="font-medium">{{ patient?.phone_number || 'Not specified' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Address</p>
            <p class="font-medium">{{ patient?.address || 'Not specified' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Emergency Contact</p>
            <p class="font-medium">{{ patient?.emergency_contact_name || 'Not specified' }}</p>
          </div>
          <div>
            <p class="text-gray-600">Emergency Contact Phone</p>
            <p class="font-medium">{{ patient?.emergency_contact_phone || 'Not specified' }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-gray-600">Medical History</p>
          <p class="font-medium whitespace-pre-line">{{ patient?.medical_history || 'No medical history recorded' }}</p>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Update Information</h2>
        <form *ngIf="patient" (ngSubmit)="updatePatient()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                [(ngModel)]="editForm.name"
                name="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="editForm.email"
                name="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                [(ngModel)]="editForm.date_of_birth"
                name="date_of_birth"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                [(ngModel)]="editForm.gender"
                name="gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                [(ngModel)]="editForm.phone_number"
                name="phone_number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                [(ngModel)]="editForm.address"
                name="address"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
              <input
                type="text"
                [(ngModel)]="editForm.emergency_contact_name"
                name="emergency_contact_name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
              <input
                type="tel"
                [(ngModel)]="editForm.emergency_contact_phone"
                name="emergency_contact_phone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Medical History -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
            <textarea
              [(ngModel)]="editForm.medical_history"
              name="medical_history"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              (click)="resetForm()"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              [disabled]="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update Patient' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditPatientComponent implements OnInit {
  patient: Patient | null = null;
  loading = false;
  editForm = {
    name: '',
    email: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other',
    phone_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: null as string | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const patientId = this.route.snapshot.params['id'];
    if (patientId) {
      this.loadPatient(patientId);
    }
  }

  loadPatient(id: number) {
    this.loading = true;
    this.patientService.getPatient(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.initializeForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.toastr.error('Error loading patient details', 'Error');
        this.loading = false;
      }
    });
  }

  initializeForm() {
    if (this.patient) {
      this.editForm = {
        name: this.patient.user.name,
        email: this.patient.user.email,
        date_of_birth: this.patient.date_of_birth,
        gender: this.patient.gender,
        phone_number: this.patient.phone_number,
        address: this.patient.address,
        emergency_contact_name: this.patient.emergency_contact_name,
        emergency_contact_phone: this.patient.emergency_contact_phone,
        medical_history: this.patient.medical_history || null
      };
    }
  }

  updatePatient() {
    if (!this.patient) return;
    
    this.loading = true;
    this.patientService.updatePatient(this.patient.id, this.editForm).subscribe({
      next: (response) => {
        this.toastr.success('Patient updated successfully', 'Success');
        this.loading = false;
        this.loadPatient(this.patient!.id); // Reload patient data
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        this.toastr.error('Error updating patient', 'Error');
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.initializeForm();
    this.toastr.info('Form has been reset', 'Info');
  }

  goBack() {
    this.router.navigate(['/admin/patients']);
  }
}
