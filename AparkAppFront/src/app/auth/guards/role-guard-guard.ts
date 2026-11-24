import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ROUTE_COMMANDS } from '../../app.route.segments';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = (route.data?.['roles'] as string[]) ?? [];
  const currentRole = auth.userRole();
  if (!currentRole) return router.createUrlTree(ROUTE_COMMANDS.home);
  const normCurrent = currentRole.startsWith('ROLE_') ? currentRole : `ROLE_${currentRole}`;
  const allowed = expectedRoles.some((r) => (r.startsWith('ROLE_') ? r : `ROLE_${r}`) === normCurrent);
  return allowed ? true : router.createUrlTree(ROUTE_COMMANDS.home);
};