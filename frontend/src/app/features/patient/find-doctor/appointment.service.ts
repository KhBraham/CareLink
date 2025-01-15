import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Appointment, AppointmentResponse } from './appointment.types';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createAppointment(appointment: Appointment): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(`${this.apiUrl}/appointments`, {
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      reasonForVisit: appointment.reasonForVisit
    });
  }

  getPatientAppointments(patientId: number): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/patients/${patientId}/appointments`);
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/appointments/${appointmentId}/cancel`, {});
  }
}
