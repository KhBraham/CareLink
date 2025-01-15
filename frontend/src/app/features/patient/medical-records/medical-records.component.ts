import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordsService } from './medical-records.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/types/user.types';
import { MedicalRecord } from './medical-record.types';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#1e2756]">My Medical Records</h1>
        <button 
          (click)="downloadMedicalRecords()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <span class="mr-2">Download Records</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Medical Records Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Doctor</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Symptoms</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Diagnosis</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Treatment</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Prescription</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @if (medicalRecords.length === 0) {
                <tr>
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">No medical records found</td>
                </tr>
              } @else {
                @for (record of medicalRecords; track record.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.date | date:'medium'}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.doctorName}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.symptoms}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.diagnosis}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.treatment}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.prescription}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{record.notes}}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];

  constructor(
    private medicalRecordsService: MedicalRecordsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user?.profile?.patientId) {
      this.loadMedicalRecords(user.profile.patientId);
    }
  }

  loadMedicalRecords(patientId: number) {
    this.medicalRecordsService.getPatientRecords(patientId).subscribe({
      next: (records) => {
        this.medicalRecords = records;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
      }
    });
  }

  downloadMedicalRecords() {
    const user = this.authService.getCurrentUser();
    if (!user?.profile?.patientId) {
      console.error('No patient ID found');
      return;
    }

    this.medicalRecordsService.downloadMedicalRecords(user.profile.patientId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical_records_${user.name}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading medical records:', error);
      }
    });
  }
}
