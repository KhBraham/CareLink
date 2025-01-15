import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Doctor {
  id?: number;
  name: string;
  email: string;
  specialization: string;
  qualifications: string;
  phone_number: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DoctorFormData {
  nameDoctor?: string;
  firstnameDoctor?: string;
  emailDoctor?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  specialization?: string;
  qualifications?: string;
}

export interface DoctorResponse {
  message: string;
  doctor: Doctor;
}

export interface PaginatedResponse {
  current_page: number;
  data: Doctor[];
  total: number;
  per_page: number;
  last_page: number;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  addDoctor(doctorData: DoctorFormData): Observable<DoctorResponse> {
    const transformedData = {
      name: `Dr. ${doctorData.firstnameDoctor} ${doctorData.nameDoctor}`.trim(),
      email: doctorData.emailDoctor,
      password: doctorData.password,
      phone_number: doctorData.phoneNumber,
      specialization: doctorData.specialization,
      qualifications: doctorData.qualifications
    };

    console.log('Sending doctor data:', transformedData);
    return this.http.post<DoctorResponse>(this.apiUrl, transformedData, { headers: this.getHeaders() });
  }

  getDoctors(page: number = 1, perPage: number = 10, search: string = ''): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateDoctor(id: number, data: Partial<DoctorFormData>): Observable<DoctorResponse> {
    const transformedData = {
      specialization: data.specialization,
      qualifications: data.qualifications,
      phone_number: data.phoneNumber,
      ...(data.email && { email: data.email }),
      ...(data.password && { password: data.password })
    };

    return this.http.put<DoctorResponse>(`${this.apiUrl}/${id}`, transformedData, { headers: this.getHeaders() });
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
