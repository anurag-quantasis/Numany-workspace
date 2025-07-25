import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth-store/auth.store';
import { MessageService } from 'primeng/api';

/**
 * Creates a CanActivateFn guard that checks for user authentication and specific roles.
 * @param allowedRoles An array of role strings. The guard will pass if the user has at least one of these roles.
 * @returns A CanActivateFn function.
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const messageService = inject(MessageService);

    // 1. Check if the user is authenticated at all.
    if (!authStore.isAuthenticated()) {
      // Redirect to login, preserving the attempted URL for a better user experience
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: router.routerState.snapshot.url },
      });
    }

    // 2. Check if the authenticated user has any of the required roles.
    if (authStore.hasRole(allowedRoles)) {
      return true; // Access granted!
    }

    // 3. User is authenticated but does not have the necessary role.
    messageService.add({
      severity: 'warn',
      summary: 'Access Denied',
      detail: 'You do not have permission to access this page.',
    });

    // Redirect to a 'forbidden' or 'unauthorized' page, or just the home page.
    return router.parseUrl('/login'); // Best practice: have a dedicated page.
  };
};
