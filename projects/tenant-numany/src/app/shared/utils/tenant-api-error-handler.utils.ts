import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export function tenantHandleHttpError(
  err: HttpErrorResponse,
  messageService: MessageService,
  summary = 'Request Failed',
  defaultMessage = 'An unexpected error occurred.',
): void {
  let errorMessages: string[] = [];

  // 400 Validation errors
  if (err.status === 400 && err.error?.errors) {
    const validationErrors = err.error.errors;
    for (const field in validationErrors) {
      if (Array.isArray(validationErrors[field])) {
        errorMessages.push(...validationErrors[field]);
      }
    }
  }
  // 401 with message as array: ["user not found"]
  else if (err.status === 401 && Array.isArray(err.error)) {
    errorMessages.push(...err.error);
  }
  // message is an array (e.g., { message: ["some message"] })
  else if (Array.isArray(err.error?.message)) {
    errorMessages.push(...err.error.message);
  }
  // message is a string
  else if (typeof err.error?.message === 'string') {
    errorMessages.push(err.error.message);
  }
  // fallback to top-level err.message
  else if (err.message) {
    errorMessages.push(err.message);
  }
  // final fallback
  else {
    errorMessages.push(defaultMessage);
  }

  // Ensure everything is a string before showing toast
  errorMessages
    .filter((msg): msg is string => typeof msg === 'string')
    .forEach((msg) => {
      messageService.add({
        key: 'custom-toast',
        severity: 'error',
        summary,
        detail: msg,
        styleClass: 'bg-white border-none',
        life: 8000,
      });
    });
}
