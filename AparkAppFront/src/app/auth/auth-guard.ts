import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { ROUTE_COMMANDS } from '../app.route.segments';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(ROUTE_COMMANDS.login);
};
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return !auth.isAuthenticated() ? true : router.createUrlTree(ROUTE_COMMANDS.home);
};
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = (route.data?.['roles'] as string[]) ?? [];
  const currentRole = auth.userRole();
  if (currentRole && expectedRoles.includes(currentRole)) {
    return true;
  }
  return router.createUrlTree(ROUTE_COMMANDS.home);
};