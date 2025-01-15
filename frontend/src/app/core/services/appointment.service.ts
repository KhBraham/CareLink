import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualifications: string;
}

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

export interface MedicalRecord {
  id: number;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  doctorName: string;
}

export interface AppointmentDetails {
  id: number;
  date: string;
  time: string;
  patient: Patient;
  doctor?: Doctor;
  type: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  symptoms: string;
  reason_for_visit: string;
  medicalRecords: MedicalRecord[];
}

export interface UpdateAppointmentDto {
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getRecentAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/recent`);
  }

  getAppointmentDetails(id: number): Observable<AppointmentDetails> {
    return this.http.get<AppointmentDetails>(`${this.apiUrl}/appointments/${id}/details`);
  }

  getAvailableDoctors(): Observable<Doctor[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/doctors`).pipe(
      map(response => response.data.map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications
      })))
    );
  }

  updateAppointment(id: number, data: UpdateAppointmentDto): Observable<AppointmentDetails> {
    return this.http.put<AppointmentDetails>(`${this.apiUrl}/appointments/${id}`, data);
  }
}
