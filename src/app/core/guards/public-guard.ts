import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
