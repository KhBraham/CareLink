import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, AppointmentDetails } from '../../../core/services/appointment.service';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Patients Card -->
        <div class="bg-[#1e2756] text-white rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">{{ stats?.totalPatients || 0 }} Patients</h3>
          </div>
          <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <!-- Total Doctors Card -->
        <div class="bg-[#E8EEF9] text-[#1e2756] rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">{{ stats?.totalDoctors || 0 }} Doctors</h3>
          </div>
          <div class="w-12 h-12 bg-[#1e2756]/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <!-- Pending appointment Card -->
        <div class="bg-[#1e2756] text-white rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">{{ stats?.pendingAppointments || 0 }} Pending Appointments</h3>
          </div>
          <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Appointments Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Recent Appointments</h2>
          <!-- Search Bar -->
          <div class="mt-4">
            <input
              type="text"
              class="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by patient name..."
              [(ngModel)]="searchQuery"
            >
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symptom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let appointment of filteredAppointments">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.time }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.patientName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.doctorName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ appointment.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(appointment.status)">
                    {{ appointment.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a [routerLink]="['/admin/appointments/edit', appointment.id]" class="text-[#00A3FF] hover:text-[#0077CC] flex items-center gap-1 text-sm font-medium">
                    View Details
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  recentAppointments: any[] = [];
  stats: DashboardStats | null = null;
  searchQuery: string = '';

  get filteredAppointments(): any[] {
    return this.recentAppointments.filter(appointment => {
      const matchesSearch = !this.searchQuery || 
        appointment.patientName?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const isActiveAppointment = appointment.status === 'pending' || appointment.status === 'confirmed';
      return matchesSearch && isActiveAppointment;
    });
  }

  constructor(
    private appointmentService: AppointmentService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadRecentAppointments();
    this.loadDashboardStats();
  }

  loadRecentAppointments() {
    this.appointmentService.getRecentAppointments().subscribe({
      next: (appointments) => {
        this.recentAppointments = appointments;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  loadDashboardStats() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800';
      case 'cancelled':
        return 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800';
      default:
        return 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800';
    }
  }
}
