export const toastSeverity = {
  error: 'error',
  warning: 'warn',
  success: 'success',
  info: 'info',
};

export const AppRoles = {
  SuperAdmin: 'SuperAdmin',
  Admin: 'Admin',
  Physician: 'Physician',
} as const;

export type AppRole = typeof AppRoles[keyof typeof AppRoles];