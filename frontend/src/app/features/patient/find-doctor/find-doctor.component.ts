import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from './appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentResponse } from './appointment.types';

@Component({
  selector: 'app-find-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Apply for Appointment Section -->
      <div class="mb-16">
        <h1 class="text-3xl font-bold text-center text-[#1e2756] mb-12">Apply for an Appointment</h1>

        <div class="max-w-2xl mx-auto space-y-6">
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Describe Your Symptoms</label>
            <textarea
              class="w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Please describe your symptoms"
              [(ngModel)]="symptomDescription"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">Preferred date :</label>
            <input
              type="datetime-local"
              class="w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="preferredDate"
            >
          </div>

          <button
            class="w-full bg-[#4A6BB6] text-white py-3 rounded-md hover:bg-[#3b5998] transition-colors"
            (click)="applyForAppointment()"
            [disabled]="!symptomDescription || !preferredDate"
          >
            Apply Now
          </button>
        </div>
      </div>

      <!-- Reserved Appointments Section -->
      <div>
        <h2 class="text-3xl font-bold text-center text-[#1e2756] mb-12">Your Appointments</h2>

        <!-- Filters -->
        <div class="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
          <!-- Search Filter -->
          <div class="flex-1">
            <input
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by symptoms or doctor name..."
              [(ngModel)]="searchQuery"
            >
          </div>
          <!-- Status Filter -->
          <div class="w-full md:w-48">
            <select
              class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              [(ngModel)]="selectedStatus"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ng-container *ngIf="getFilteredAppointments().length === 0">
            <div class="col-span-2 text-center text-gray-500">
              No appointments found
            </div>
          </ng-container>
          <ng-container *ngIf="getFilteredAppointments().length > 0">
            <div *ngFor="let appointment of getFilteredAppointments(); trackBy: trackAppointmentById"
                 class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold">Appointment</h3>
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                  [ngClass]="{
                    'bg-yellow-100 text-yellow-800': appointment.status === 'pending',
                    'bg-green-100 text-green-800': appointment.status === 'confirmed',
                    'bg-red-100 text-red-800': appointment.status === 'cancelled',
                    'bg-blue-100 text-blue-800': appointment.status === 'completed'
                  }"
                >
                  {{appointment.status | titlecase}}
                </span>
              </div>
              <p class="text-gray-600 mb-2">Date: {{appointment.appointmentDate | date:'medium'}}</p>
              <ng-container *ngIf="appointment.doctorName">
                <p class="text-gray-600 mb-4">Doctor: {{appointment.doctorName}}</p>
              </ng-container>
              <p class="text-gray-500 mb-4">Symptoms: {{appointment.reasonForVisit}}</p>
              <ng-container *ngIf="appointment.status === 'pending'">
                <button
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                  (click)="cancelAppointment(appointment.id)"
                >
                  Cancel Appointment
                </button>
              </ng-container>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FindDoctorComponent implements OnInit {
  symptomDescription: string = '';
  preferredDate: string = '';
  appointments: AppointmentResponse[] = [];
  searchQuery: string = '';
  selectedStatus: string = 'all';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.profile?.patientId) {
      this.loadAppointments(user.profile.patientId);
    }
  }

  loadAppointments(patientId: number) {
    this.appointmentService.getPatientAppointments(patientId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  getFilteredAppointments(): AppointmentResponse[] {
    return this.appointments.filter(appointment => {
      const matchesSearch = this.searchQuery
        ? (appointment.reasonForVisit?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
           appointment.doctorName?.toLowerCase().includes(this.searchQuery.toLowerCase()))
        : true;

      const matchesStatus = this.selectedStatus === 'all' || appointment.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  applyForAppointment() {
    if (!this.symptomDescription || !this.preferredDate) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user?.profile?.patientId) {
      console.error('No patient ID found');
      return;
    }

    const appointment = {
      patientId: user.profile.patientId,
      appointmentDate: this.preferredDate,
      reasonForVisit: this.symptomDescription
    };

    this.appointmentService.createAppointment(appointment).subscribe({
      next: (response) => {
        // Add the new appointment to the list
        this.appointments = [response, ...this.appointments];

        // Reset form
        this.symptomDescription = '';
        this.preferredDate = '';
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
      }
    });
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        // Update the status in the UI
        this.appointments = this.appointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' as const }
            : appointment
        );
      },
      error: (error) => {
        console.error('Error cancelling appointment:', error);
      }
    });
  }

  trackAppointmentById(index: number, appointment: AppointmentResponse) {
    return appointment.id;
  }
}
