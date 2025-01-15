import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/patient-home.component').then(m => m.PatientHomeComponent)
  },
  {
    path: 'find-doctor',
    loadComponent: () => import('./find-doctor/find-doctor.component').then(m => m.FindDoctorComponent)
  },
  {
    path: 'medical-records',
    loadComponent: () => import('./medical-records/medical-records.component').then(m => m.MedicalRecordsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  }
  // Add other patient routes here
];
