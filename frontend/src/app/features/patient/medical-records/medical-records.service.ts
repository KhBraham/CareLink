import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MedicalRecord } from './medical-record.types';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatientRecords(patientId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/medical-records/patient/${patientId}`);
  }

  downloadMedicalRecords(patientId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/medical-records/${patientId}/download`, {
      responseType: 'blob'
    });
  }
}
