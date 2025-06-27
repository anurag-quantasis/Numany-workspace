import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { AuthState } from '../auth-store/auth.state';
import { hasPermission as checkPermission,Permissions } from './role';

export function withPermissions() {
  return signalStoreFeature(
    // We expect the store to have the AuthState shape
    { state: type<AuthState>() },
    // We add a new computed signal to the store
    withComputed(({ user }) => ({
      // This `hasPermission` method is now part of our store!
      hasPermission: computed(() => 
        <Resource extends keyof Permissions>(
          resource: Resource,
          action: Permissions[Resource]["action"],
          data?: Permissions[Resource]["dataType"]
        ): boolean => {
          const currentUser = user();
          if (!currentUser) {
            return false; // If no user is logged in, they have no permissions.
          }
          return checkPermission(currentUser, resource, action, data);
        }
      )
    }))
  );
}