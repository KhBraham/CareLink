import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get the required roles from the route data
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.authService.getCurrentUserRole();

    // If no specific roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    // If user's role doesn't match, redirect to appropriate home page
    this.redirectBasedOnRole(userRole || 'patient');
    return false;
  }

  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'patient':
        this.router.navigate(['/patient/home']);
        break;
      case 'doctor':
        this.router.navigate(['/doctor/home']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
