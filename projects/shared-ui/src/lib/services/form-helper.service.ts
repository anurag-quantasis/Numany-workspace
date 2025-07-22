import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormHelper {
  getFormControl(useForm: FormGroup, controlName: string) {
    return useForm.get(controlName) as FormControl;
  }

  updateFormState(form: FormGroup, isDirty: boolean = true, isTouched: boolean = true) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.controls[controlName];
        if (isDirty) control.markAsDirty();
        if (isTouched) control.markAsTouched();
      }
    }
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors["confirmedValidator"]) return;
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  validateHourInput(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }
    const currentValue = (event.target as HTMLInputElement).value;
    const newValue = currentValue + key;
    const numberValue = parseInt(newValue, 10);
    if (numberValue > 23) event.preventDefault();
  }

  validateMinuteInput(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }
    const currentValue = (event.target as HTMLInputElement).value;
    const newValue = currentValue + key;
    const numberValue = parseInt(newValue, 10);
    if (numberValue > 59) event.preventDefault();
  }
}