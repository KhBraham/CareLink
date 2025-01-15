import { Routes } from '@angular/router';
import { AdminLayoutComponent } from 'src/app/layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './login/admin-login.component';
import { ManageDoctorsComponent } from './doctors/manage-doctors.component';
import { EditDoctorComponent } from './doctors/edit-doctor.component';
import { ManagePatientsComponent } from './patients/manage-patients.component';
import { EditPatientComponent } from './patients/edit-patient.component';
import { EditAppointmentComponent } from './appointments/edit-appointment.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminLoginComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'doctors',
        component: ManageDoctorsComponent,
      },
      {
        path: 'doctors/edit/:id',
        component: EditDoctorComponent,
      },
      {
        path: 'patients',
        component: ManagePatientsComponent,
      },
      {
        path: 'patients/edit/:id',
        component: EditPatientComponent,
      },
      {
        path: 'appointments/edit/:id',
        component: EditAppointmentComponent,
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
