import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    console.log('🔒 Auth Guard: Token found, allowing access');
    return true;
  }

  console.log('🔒 Auth Guard: No token, redirecting to login');
  router.navigate(['/login']);
  return false;
};
