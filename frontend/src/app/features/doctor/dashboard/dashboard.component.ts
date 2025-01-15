import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

export interface Appointment {
  id: number;
  appointment_datetime: string;
  reason_for_visit: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  patient: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule]
})
export class DashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUpcomingAppointments();
  }

  loadUpcomingAppointments() {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${token}`
    );

    this.http.get<{ data: Appointment[] }>(
      `${environment.apiUrl}/doctor/appointments`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.appointments = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error = 'Failed to load appointments';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800';
      case 'cancelled':
        return 'px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800';
      case 'completed':
        return 'px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800';
      default:
        return 'px-2 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800';
    }
  }

  formatDateTime(dateTime: string): { date: string, time: string } {
    const dt = new Date(dateTime);
    return {
      date: dt.toLocaleDateString(),
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  getConfirmedAppointmentsCount(): number {
    return this.appointments.filter(a => a.status === 'confirmed').length;
  }

  getPendingAppointmentsCount(): number {
    return this.appointments.filter(a => a.status === 'pending').length;
  }

  getCompletedAppointmentsCount(): number {
    return this.appointments.filter(a => a.status === 'completed').length;
  }

  getTotalAppointmentsCount(): number {
    return this.appointments.length;
  }
}
