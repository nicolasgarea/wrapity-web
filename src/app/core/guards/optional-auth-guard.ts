import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const optionalAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (token && !authService.currentUser()) {
    try {
      await firstValueFrom(authService.getMe());
    } catch {
      localStorage.removeItem('access_token');
    }
  }

  return true;
};
