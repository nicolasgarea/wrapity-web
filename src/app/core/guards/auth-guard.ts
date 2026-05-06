import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  if (!authService.currentUser()) {
    try {
      await firstValueFrom(authService.getMe());
    } catch {
      localStorage.removeItem('access_token');
      return router.createUrlTree(['/auth/login']);
    }
  }

  return true;
};
