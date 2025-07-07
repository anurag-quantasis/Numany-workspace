import { FormControl, ValidationErrors } from "@angular/forms";

// Example custom validator function
export function noNegativeValues(control: FormControl): ValidationErrors | null {
  return control.value < 0 ? { noNegative: true } : null;
}