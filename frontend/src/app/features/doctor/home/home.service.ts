import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorProfile } from './home.types';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getDoctorProfile(doctorId: number): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(`${this.API_URL}/doctors/${doctorId}`);
  }

  updateDoctorProfile(doctorId: number, profile: Partial<DoctorProfile>): Observable<DoctorProfile> {
    return this.http.put<DoctorProfile>(`${this.API_URL}/doctors/${doctorId}`, profile);
  }
}
