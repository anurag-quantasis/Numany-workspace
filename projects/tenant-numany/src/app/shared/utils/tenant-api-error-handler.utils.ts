// utils/error-handler.util.ts

import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export function tenantHandleHttpError(
  err: HttpErrorResponse,
  messageService: MessageService,
  summary = 'Request Failed',
  defaultMessage = 'An unexpected error occurred.'
): void {
  let errorMessages: string[] = [];

  if (err.status === 400 && err.error?.errors) {
    const validationErrors = err.error.errors;
    for (const field in validationErrors) {
      if (Array.isArray(validationErrors[field])) {
        errorMessages.push(...validationErrors[field]);
      }
    }
  } else if (err.error?.message) {
    errorMessages.push(err.error.message);
  } else if (err.message) {
    errorMessages.push(err.message);
  } else {
    errorMessages.push(defaultMessage);
  }

  // Show one toast per message (you can change this to show a single toast if you prefer)
  errorMessages.forEach(msg => {
    messageService.add({
      key: 'custom-toast',
      severity: 'error',
      summary,
      detail: msg,
      styleClass: 'bg-white border-none',
      life: 8000
    });
  });
}
