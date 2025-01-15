import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RegisterPatientRequest } from '../interfaces/register-patient-request.interface';

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'patient' | 'doctor' | 'admin';
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  profile?: {
    patientId?: number;
    doctorId?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user and token from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  register(data: RegisterPatientRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/register`, data).pipe(
      tap(response => {
        // Store the token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Update the subjects
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(credentials: LoginCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  adminLogin(credentials: LoginCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/admin/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        this.tokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Clear stored data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        
        // Reset subjects
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);

        // Navigate to login
        this.router.navigate(['/login']);
      })
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserRole(): 'patient' | 'doctor' | 'admin' | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
