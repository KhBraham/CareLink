import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorProfile } from './profile.types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getDoctorProfile(id: number): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(`${this.apiUrl}/doctors/${id}`);
  }

  updateDoctorProfile(id: number, profile: Partial<DoctorProfile>): Observable<DoctorProfile> {
    return this.http.put<DoctorProfile>(`${this.apiUrl}/doctors/${id}`, profile);
  }
}
