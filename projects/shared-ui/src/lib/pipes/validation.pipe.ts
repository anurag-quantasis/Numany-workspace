import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'validation',
  standalone: true,
})
export class ValidationPipe implements PipeTransform {
  // Takes form errors and returns a user-friendly string.
  transform(
    errors: ValidationErrors | null | undefined,
    customMessages: { [key: string]: string } = {},
  ): string {
    if (!errors) return '';

    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];

    // Use a custom message if one was provided for this specific instance.
    if (customMessages[errorKey]) {
      return customMessages[errorKey];
    }

    // Otherwise, fallback to a global list of default messages.
    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'email':
        return 'Please enter a valid email address.';
      case 'minlength':
        return `Minimum length must be ${errorValue.requiredLength}.`;
      case 'min':
        return `The minimum value is ${errorValue.min}.`;
      case 'noNegative':
        return 'Value cannot be negative.';
      // Add more global default messages here.
      default:
        return 'This field has an error.';
    }
  }
}
