import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
// import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { CustomInputComponent } from 'shared-ui';
import { TpBillingOption } from './tenant-provider-numbers.model';

@Component({
  selector: 'tenant-provider-numbers',
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent, ButtonModule, SelectModule],
  templateUrl: './tenant-provider-numbers.component.html',
  styleUrl: './tenant-provider-numbers.component.css',
})
export class TenantProviderNumbersComponent {
  private readonly fb = inject(FormBuilder);

  readonly tpBillingOptions: TpBillingOption[] = [
    { label: 'Disabled', value: 0 },
    { label: 'On Order Entry', value: 1 },
    { label: 'Using Daily Charge Batch', value: 2 },
    { label: 'Order Entry and Batch', value: 3 },
  ];

  providerNumbersForm = this.fb.group({
    deaNumber: ['', [Validators.maxLength(10)]],
    ncpdpNumber: [''],
    medicareProvider: [''],
    medicaidProvider: [''],
    npi: [''],
    stateLicense: ['', [Validators.maxLength(10)]],
    tpBilling: [null as number | null, [Validators.required]], // Typed for clarity
  });

  onSubmit(): void {
    if (this.providerNumbersForm.invalid) {
      console.log('Form is invalid. Please check the required fields.');
      this.providerNumbersForm.markAllAsTouched();
      return;
    }
    const formData = this.providerNumbersForm.getRawValue();
    console.log('Submitting Provider Numbers:', formData);
  }

  resetForm(): void {
    this.providerNumbersForm.reset();
  }
}
