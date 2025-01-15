import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { PatientLayoutComponent } from './layouts/patient-layout/patient-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // Patient routes
  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'patient' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/patient/home/patient-home.component').then(m => m.PatientHomeComponent)
      },
      {
        path: 'find-doctor',
        loadComponent: () => import('./features/patient/find-doctor/find-doctor.component').then(m => m.FindDoctorComponent)
      },
      {
        path: 'medical-records',
        loadComponent: () => import('./features/patient/medical-records/medical-records.component').then(m => m.MedicalRecordsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/patient/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Doctor routes
  {
    path: 'doctor',
    loadChildren: () => import('./features/doctor/doctor.routes').then(m => m.DOCTOR_ROUTES),
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },

  // Admin routes
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },

  // Fallback route
  {
    path: '**',
    redirectTo: 'home'
  }
];
