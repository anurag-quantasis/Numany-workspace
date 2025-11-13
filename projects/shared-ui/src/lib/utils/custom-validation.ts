import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Example custom validator function
export function noNegativeValues(control: FormControl): ValidationErrors | null {
  return control.value < 0 ? { noNegative: true } : null;
}

// High Normal value should be greater than low Normal
export function highGreaterThanLowValidator(lowKey: string, highKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const low = parseFloat(group.get(lowKey)?.value);
    const high = parseFloat(group.get(highKey)?.value);

    if (!isNaN(low) && !isNaN(high) && high < low) {
      return { highLessThanLow: true };
    }

    return null;
  };
}
