import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PatientProfile } from './profile.types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatientProfile(patientId: number): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.apiUrl}/patients/${patientId}`);
  }

  updatePatientProfile(patientId: number, profile: Partial<PatientProfile>): Observable<PatientProfile> {
    return this.http.put<PatientProfile>(`${this.apiUrl}/patients/${patientId}`, profile);
  }
}
