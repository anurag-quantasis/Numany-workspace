import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent } from 'shared-ui';
import { CustomInputComponent } from 'shared-ui';
import { VendorStore } from './vendor-supplier-store/vendor-supplier.store';
import { Vendor } from './vendor-supplier-store/vendor-supplier.model';

@Component({
  selector: 'tenant-vendor-supplier',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SharedPanelContainerComponent,
    CustomInputComponent,
  ],
  templateUrl: './vendor-supplier.component.html',
  styleUrls: ['./vendor-supplier.component.css'],
  providers: [VendorStore],
})
export class VendorSupplierComponent implements OnInit {
  readonly store = inject(VendorStore);
  private readonly fb = inject(FormBuilder);

  vendorForm!: FormGroup;
  isAdding = false;

  ngOnInit(): void {
    this.initializeForm();

    this.store.loadVendor();

    this.vendorForm.get('selectedOption')?.valueChanges.subscribe((vendor: Vendor | null) => {
      this.onVendorSelect(vendor);
    });
  }

  private initializeForm(): void {
    this.vendorForm = this.fb.group({
      selectedOption: [null],

      id_vend: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(12),
      ]),
      acct_no: ['', Validators.maxLength(12)],
      nam_vend: ['', [Validators.required, Validators.maxLength(50)]],
      vm_td: ['', Validators.pattern(/^-?\d*(\.\d+)?$/)],
      vy_td: ['', Validators.pattern(/^-?\d*(\.\d+)?$/)],
      note: ['', Validators.maxLength(100)],
    });
  }

  onVendorSelect(vendor: Vendor | null): void {
    if (vendor) {
      this.vendorForm.patchValue(vendor);
      this.vendorForm.get('id_vend')?.disable();
      this.isAdding = false;
    } else {
      this.resetFormAndState();
    }
  }

  onAdd(): void {
    this.isAdding = true;
    this.vendorForm.reset({}, { emitEvent: false });
    this.vendorForm.get('id_vend')?.enable();
  }

  onCancel(): void {
    this.resetFormAndState();
  }

  onSave(): void {
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }
    const newVendor = this.vendorForm.value as Vendor;
    this.store.addVendor(newVendor);
    this.resetFormAndState();
  }

  onUpdate(): void {
    if (!this.vendorForm.get('id_vend')?.value) {
      console.warn('No vendor selected for update.');
      return;
    }
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }
    const updatedVendor = this.vendorForm.getRawValue() as Vendor;
    this.store.updateVendor(updatedVendor);
  }

  onDelete(): void {
    const vendorId = this.vendorForm.get('id_vend')?.value;
    if (!vendorId) {
      console.warn('No vendor selected for deletion.');
      return;
    }
    this.store.deleteVendor(vendorId);
    this.resetFormAndState();
  }

  private resetFormAndState(): void {
    this.isAdding = false;
    this.vendorForm.reset({}, { emitEvent: false });
    this.vendorForm.get('id_vend')?.disable();
  }
}
