import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Patient {
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

export interface PatientResponse {
  message: string;
  patient: Patient;
}

export interface PaginatedResponse {
  current_page: number;
  data: Patient[];
  total: number;
  per_page: number;
  last_page: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  getPatients(page: number = 1, perPage: number = 10, search: string = ''): Observable<PaginatedResponse> {
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

  createPatient(patientData: any): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(this.apiUrl, patientData, { headers: this.getHeaders() });
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updatePatient(id: number, patientData: any): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.apiUrl}/${id}`, patientData, { headers: this.getHeaders() });
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
