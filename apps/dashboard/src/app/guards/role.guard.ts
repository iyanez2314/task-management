import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleType } from '@turbovets/data/frontend';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserSubject.value;

    if (!currentUser || !currentUser.role) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as RoleType[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const hasRole = requiredRoles.includes(currentUser.role.name as RoleType);

    if (!hasRole) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
