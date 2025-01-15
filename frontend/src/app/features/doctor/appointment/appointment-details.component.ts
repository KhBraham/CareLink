import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  medicalRecords: MedicalRecord[];
}

interface MedicalRecord {
  id: number;
  doctor: {
    user: {
      name: string;
    }
  };
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  created_at: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  appointment_datetime: string;
  reason_for_visit: string;
  status: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
}

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{error}}
      </div>

      <div *ngIf="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A3FF]"></div>
      </div>

      <div *ngIf="!isLoading && appointment">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-[#1e2756]">Appointment Details</h1>
          <button 
            routerLink="/doctor/dashboard"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <!-- Patient Information Section -->
        <div class="mb-8 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-[#1e2756] mb-6">Patient Information</h2>
          
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Basic Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500">Full Name</label>
                  <p class="text-gray-900">{{appointment.patient.user.name}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Email</label>
                  <p class="text-gray-900">{{appointment.patient.user.email}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p class="text-gray-900">{{formatDate(appointment.patient.date_of_birth)}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Gender</label>
                  <p class="text-gray-900">{{appointment.patient.gender | titlecase}}</p>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500">Phone Number</label>
                  <p class="text-gray-900">{{appointment.patient.phone_number}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500">Address</label>
                  <p class="text-gray-900">{{appointment.patient.address}}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="border-t pt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-4">Emergency Contact</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500">Name</label>
                <p class="text-gray-900">{{appointment.patient.emergency_contact_name}}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Phone</label>
                <p class="text-gray-900">{{appointment.patient.emergency_contact_phone}}</p>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="border-t pt-6 mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-4">Medical History</h3>
            <p class="text-gray-900 whitespace-pre-line">{{appointment.patient.medical_history || 'No medical history recorded.'}}</p>
          </div>
        </div>

        <!-- Previous Medical Records -->
        <div class="mb-8 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-[#1e2756] mb-6">Previous Medical Records</h2>
          
          <div *ngIf="!appointment.patient.medicalRecords?.length" class="text-gray-500">
            No previous medical records found.
          </div>

          <div class="overflow-x-auto" *ngIf="appointment.patient.medicalRecords?.length">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let record of appointment.patient.medicalRecords" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-pre text-sm text-gray-900">
                    {{formatMedicalRecordDate(record.created_at)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{record.doctor.user.name}}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-xs overflow-hidden">
                      {{record.symptoms}}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-xs overflow-hidden">
                      {{record.diagnosis}}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-xs overflow-hidden">
                      {{record.treatment}}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-xs overflow-hidden">
                      {{record.prescription || '-'}}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-xs overflow-hidden">
                      {{record.notes || '-'}}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Appointment Details Section -->
        <div class="mb-8 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-[#1e2756] mb-6">Appointment Details</h2>
          
          <!-- Appointment Status Card -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div class="text-sm text-blue-600 mb-1">Status</div>
              <div class="flex items-center">
                <span [class]="getStatusClass(appointment.status)" class="inline-flex items-center">
                  <span class="w-2 h-2 rounded-full mr-2" 
                    [ngClass]="{
                      'bg-yellow-400': appointment.status === 'pending',
                      'bg-green-400': appointment.status === 'confirmed',
                      'bg-red-400': appointment.status === 'cancelled',
                      'bg-blue-400': appointment.status === 'completed'
                    }"
                  ></span>
                  {{appointment.status | titlecase}}
                </span>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div class="text-sm text-purple-600 mb-1">Date</div>
              <div class="font-medium text-gray-900">
                {{formatDate(appointment.appointment_datetime)}}
              </div>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
              <div class="text-sm text-indigo-600 mb-1">Time</div>
              <div class="font-medium text-gray-900">
                {{formatTime(appointment.appointment_datetime)}}
              </div>
            </div>
          </div>

          <!-- Reason for Visit -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reason for Visit
            </h3>
            <p class="text-gray-900 whitespace-pre-line bg-white rounded-lg p-4 border border-gray-100">
              {{appointment.reason_for_visit}}
            </p>
          </div>

          <!-- Previous Notes -->
          <div *ngIf="appointment.notes" class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Previous Notes
            </h3>
            <p class="text-gray-900 whitespace-pre-line bg-white rounded-lg p-4 border border-gray-100">
              {{appointment.notes}}
            </p>
          </div>
        </div>

        <!-- Consultation Form -->
        <div class="mb-8 bg-white rounded-lg shadow p-6" *ngIf="appointment.status !== 'completed'">
          <h2 class="text-xl font-bold text-[#1e2756] mb-6">New Consultation</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Symptoms:</label>
              <textarea 
                [(ngModel)]="symptoms"
                class="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter patient symptoms..."
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Diagnosis:</label>
              <textarea 
                [(ngModel)]="diagnosis"
                class="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter diagnosis..."
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Treatment:</label>
              <textarea 
                [(ngModel)]="treatment"
                class="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter treatment plan..."
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prescription (Optional):</label>
              <textarea 
                [(ngModel)]="prescription"
                class="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter prescription details..."
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes:</label>
              <textarea 
                [(ngModel)]="consultationNotes"
                class="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter any additional notes..."
                rows="3"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button 
                (click)="validateConsultation()"
                class="px-6 py-2 bg-[#1e2756] text-white rounded-md hover:bg-[#2a3572] transition-colors"
              >
                Complete Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppointmentDetailsComponent implements OnInit {
  appointment: Appointment | null = null;
  isLoading = false;
  error = '';
  consultationNotes = '';
  symptoms = '';
  diagnosis = '';
  treatment = '';
  prescription = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadAppointmentDetails(params['id']);
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  loadAppointmentDetails(appointmentId: string) {
    this.isLoading = true;
    const headers = this.getHeaders();

    this.http.get<{data: Appointment}>(
      `${environment.apiUrl}/doctor/appointments/${appointmentId}`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.appointment = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.error = 'Failed to load appointment details';
        this.isLoading = false;
      }
    });
  }

  validateConsultation() {
    if (!this.appointment) {
      this.error = 'No appointment found';
      return;
    }

    if (!this.symptoms.trim() || !this.diagnosis.trim() || !this.treatment.trim()) {
      this.error = 'Please fill in symptoms, diagnosis, and treatment';
      return;
    }

    const headers = this.getHeaders();
    
    this.http.put(
      `${environment.apiUrl}/doctor/appointments/${this.appointment.id}`,
      {
        status: 'completed',
        symptoms: this.symptoms,
        diagnosis: this.diagnosis,
        treatment: this.treatment,
        prescription: this.prescription,
        notes: this.consultationNotes
      },
      { headers }
    ).subscribe({
      next: () => {
        this.appointment!.status = 'completed';
        this.loadAppointmentDetails(this.appointment!.id.toString());
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        this.error = 'Failed to save consultation';
      }
    });
  }

  formatDate(dateTime: string): string {
    const dt = new Date(dateTime);
    return dt.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateTime: string): string {
    const dt = new Date(dateTime);
    return dt.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDateTime(dateTime: string): string {
    const dt = new Date(dateTime);
    return dt.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatMedicalRecordDate(dateTime: string): string {
    const dt = new Date(dateTime);
    return dt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ',\n' + dt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending':
        return `${baseClasses} text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} text-green-800`;
      case 'cancelled':
        return `${baseClasses} text-red-800`;
      case 'completed':
        return `${baseClasses} text-blue-800`;
      default:
        return baseClasses;
    }
  }
}
