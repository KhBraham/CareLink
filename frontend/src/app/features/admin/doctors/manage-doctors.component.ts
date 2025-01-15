import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService, Doctor, DoctorFormData, DoctorResponse, PaginatedResponse } from '../../../core/services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManageDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  newDoctor: DoctorFormData = {
    nameDoctor: '',
    firstnameDoctor: '',
    emailDoctor: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    specialization: '',
    qualifications: ''
  };

  // Pagination and Search
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // UI State
  passwordMismatch: boolean = false;
  loading: boolean = false;
  error: string = '';
  showDeleteModal: boolean = false;
  selectedDoctor: Doctor | null = null;
  protected readonly Math = Math;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.currentPage = 1;
      this.loadDoctors();
    });
  }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;
    this.doctorService.getDoctors(this.currentPage, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response: PaginatedResponse) => {
        this.doctors = response.data;
        this.totalItems = response.total;
        this.totalPages = response.last_page;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Error loading doctors', 'Error');
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  changePage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDoctors();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  addDoctor() {
    if (this.isValidDoctor(this.newDoctor)) {
      if (this.newDoctor.password !== this.newDoctor.confirmPassword) {
        this.passwordMismatch = true;
        this.toastr.error('Passwords do not match', 'Error');
        return;
      }
      
      this.passwordMismatch = false;
      this.loading = true;
      
      this.doctorService.addDoctor(this.newDoctor).subscribe({
        next: (response: DoctorResponse) => {
          this.toastr.success('Doctor added successfully!', 'Success');
          this.resetForm();
          this.loadDoctors();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error adding doctor:', error);
          if (error.error?.message) {
            this.toastr.error(error.error.message, 'Error');
          } else if (error.error?.errors?.email) {
            this.toastr.error('This email is already in use', 'Error');
          } else {
            this.toastr.error('Error adding doctor', 'Error');
          }
          this.loading = false;
        }
      });
    }
  }

  resetForm() {
    this.newDoctor = {
      nameDoctor: '',
      firstnameDoctor: '',
      emailDoctor: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      specialization: '',
      qualifications: ''
    };
    this.passwordMismatch = false;
    this.error = '';
  }

  confirmDelete(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedDoctor = null;
  }

  confirmDeleteDoctor() {
    if (this.selectedDoctor) {
      this.loading = true;
      this.doctorService.deleteDoctor(this.selectedDoctor.id!).subscribe({
        next: () => {
          this.doctors = this.doctors.filter(d => d.id !== this.selectedDoctor?.id);
          this.toastr.success('Doctor deleted successfully!', 'Success');
          this.loading = false;
          this.showDeleteModal = false;
          this.selectedDoctor = null;
        },
        error: (error: any) => {
          console.error('Error deleting doctor:', error);
          this.toastr.error('Error deleting doctor', 'Error');
          this.loading = false;
          this.showDeleteModal = false;
          this.selectedDoctor = null;
        }
      });
    }
  }

  editDoctor(doctor: Doctor) {
    if (doctor && doctor.id) {
      this.router.navigate(['/admin/doctors/edit', doctor.id]);
    } else {
      this.toastr.error('Cannot edit doctor: Invalid doctor data', 'Error');
    }
  }

  private isValidDoctor(doctor: DoctorFormData): boolean {
    if (!doctor.nameDoctor || !doctor.firstnameDoctor || !doctor.emailDoctor || 
        !doctor.password || !doctor.phoneNumber || !doctor.specialization || 
        !doctor.qualifications) {
      this.toastr.error('Please fill in all required fields', 'Error');
      return false;
    }
    
    if (doctor.password.length < 8) {
      this.toastr.error('Password must be at least 8 characters long', 'Error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doctor.emailDoctor)) {
      this.toastr.error('Please enter a valid email address', 'Error');
      return false;
    }

    return true;
  }
}
