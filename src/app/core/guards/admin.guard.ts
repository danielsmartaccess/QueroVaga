import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is admin
  const currentUser = authService.currentUserValue;
  if (currentUser && currentUser.is_admin) {
    return true;
  }

  // Navigate to main page if not admin
  router.navigate(['/parking-spaces']);
  return false;
};
