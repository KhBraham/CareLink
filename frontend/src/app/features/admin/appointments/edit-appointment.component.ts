import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService, AppointmentDetails, Doctor, UpdateAppointmentDto } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8" *ngIf="appointment">
      <div class="max-w-5xl mx-auto px-4">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Appointment Details</h1>
            <p class="mt-2 text-gray-600">Review and manage appointment information</p>
          </div>
          <div class="flex items-center space-x-2">
            <span [class]="getStatusBadgeClass(appointment.status)">
              {{ appointment.status | titlecase }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left Column - Patient Info & Medical Records -->
          <div class="col-span-1 md:col-span-2 space-y-6 min-w-0 md:min-w-96">
            <!-- Patient Information Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 class="text-lg font-semibold text-gray-900">Patient Information</h2>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Full Name</p>
                    <p class="text-gray-900">{{ appointment.patient.name }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p class="text-gray-900">{{ appointment.patient.dateOfBirth | date:'mediumDate' }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Gender</p>
                    <p class="text-gray-900">{{ appointment.patient.gender }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Phone</p>
                    <p class="text-gray-900">{{ appointment.patient.phone }}</p>
                  </div>
                  <div class="space-y-1 col-span-2">
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="text-gray-900">{{ appointment.patient.email }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medical History Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 class="text-lg font-semibold text-gray-900">Medical History</h2>
              </div>
              <div class="divide-y divide-gray-100">
                <div *ngFor="let record of appointment.medicalRecords" class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ record.date | date:'mediumDate' }}</p>
                      <p class="text-sm text-gray-500">Dr. {{ record.doctorName }}</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Diagnosis</p>
                      <p class="mt-1 text-gray-900">{{ record.diagnosis }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Prescription</p>
                      <p class="mt-1 text-gray-900">{{ record.prescription }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Notes</p>
                      <p class="mt-1 text-gray-900">{{ record.notes }}</p>
                    </div>
                  </div>
                </div>
                <p *ngIf="appointment.medicalRecords.length === 0" class="p-6 text-gray-500 text-center">
                  No medical records found
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column - Appointment Details & Form -->
          <div class="space-y-6">
            <!-- Current Appointment Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 class="text-lg font-semibold text-gray-900">Current Visit</h2>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Reason for Visit</p>
                  <p class="mt-1 text-gray-900">{{ appointment.reason_for_visit }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Symptoms</p>
                  <p class="mt-1 text-gray-900">{{ appointment.symptoms }}</p>
                </div>
              </div>
            </div>

            <!-- Update Appointment Form -->
            <form (ngSubmit)="updateAppointment()" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 class="text-lg font-semibold text-gray-900">Update Appointment</h2>
              </div>
              <div class="p-6 space-y-6">
                <!-- Doctor Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Assign Doctor <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.doctorId"
                    name="doctorId"
                    required
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2756] focus:border-transparent"
                  >
                    <option [ngValue]="null">Select a doctor</option>
                    <option *ngFor="let doctor of availableDoctors" [value]="doctor.id">
                       {{ doctor.name }} - {{ doctor.specialization }}
                    </option>
                  </select>
                </div>

                <!-- Date and Time -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      [(ngModel)]="formData.appointmentDate"
                      name="appointmentDate"
                      required
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2756] focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Time <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      [(ngModel)]="formData.appointmentTime"
                      name="appointmentTime"
                      required
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2756] focus:border-transparent"
                    >
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="formData.status"
                    name="status"
                    required
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2756] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <!-- Error Message -->
                <p *ngIf="error" class="text-sm text-red-600">{{ error }}</p>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="w-full bg-[#1e2756] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e2756]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  [disabled]="!isFormValid()"
                >
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EditAppointmentComponent implements OnInit {
  appointment: AppointmentDetails | null = null;
  availableDoctors: Doctor[] = [];
  error: string = '';

  formData: UpdateAppointmentDto = {
    doctorId: 0,
    appointmentDate: '',
    appointmentTime: '',
    status: 'pending'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadAppointment(id);
    this.loadDoctors();
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  loadAppointment(id: number) {
    this.appointmentService.getAppointmentDetails(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        // Pre-fill form data
        this.formData = {
          doctorId: appointment.doctor?.id || 0,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          status: appointment.status
        };
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.error = 'Failed to load appointment details';
      }
    });
  }

  loadDoctors() {
    this.appointmentService.getAvailableDoctors().subscribe({
      next: (doctors) => {
        this.availableDoctors = doctors;
        // If we have a current doctor, make sure it's selected
        if (this.appointment?.doctor?.id) {
          this.formData.doctorId = this.appointment.doctor.id;
        }
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.error = 'Failed to load available doctors';
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.formData.doctorId &&
      this.formData.appointmentDate &&
      this.formData.appointmentTime &&
      this.formData.status
    );
  }

  updateAppointment() {
    if (!this.appointment || !this.isFormValid()) {
      return;
    }

    this.appointmentService.updateAppointment(this.appointment.id, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        this.error = 'Failed to update appointment';
      }
    });
  }
}
