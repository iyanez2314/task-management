import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('🔒 Auth Guard: User authenticated, allowing access');
    return true;
  }

  console.log('🔒 Auth Guard: Not authenticated, redirecting to login');
  router.navigate(['/login']);
  return false;
};
