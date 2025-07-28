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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
    ConfirmDialog,
  ],
  templateUrl: './vendor-supplier.component.html',
  styleUrls: ['./vendor-supplier.component.css'],
  providers: [VendorStore, ConfirmationService],
})
export class VendorSupplierComponent implements OnInit {
  readonly store = inject(VendorStore);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

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
    const vendor = this.store.addVendor(newVendor);
    if (vendor) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'success',
        summary: 'Successful',
        detail: 'New Vendor added successfully.',
        styleClass: 'bg-white border-none',
      });
      this.resetFormAndState();
    }
  }

  onUpdate(): void {
    if (!this.vendorForm.get('id_vend')?.value) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'No vendor selected for update.',
        styleClass: 'bg-white border-none',
      });
      return;
    }
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Fill all the required details.',
        styleClass: 'bg-white border-none',
      });
      return;
    }
    const updatedVendor = this.vendorForm.getRawValue() as Vendor;
    const updateVendor = this.store.updateVendor(updatedVendor);
    if (updateVendor) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'success',
        summary: 'Successful',
        detail: 'Updated successfully',
        styleClass: 'bg-white border-none',
      });
    }
  }

  onDelete(): void {
    const vendorId = this.vendorForm.get('id_vend')?.value;
    const vendorName = this.vendorForm.get('nam_vend')?.value;
    if (!vendorId) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'No vendor selected for deletion.',
        styleClass: 'bg-white bg-none',
      });
      return;
    } else {
      this.confirmationService.confirm({
        key: 'delete-vendor-confirmation',
        closable: true,
        closeOnEscape: true,
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Delete',
        },
        message: `Are you sure you want to delete ${vendorName}`,
        header: 'Confirm Deletion',
        icon: 'pi pi-trash',
        accept: () => {
          this.store.deleteVendor(vendorId);
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Successful',
            detail: 'Deleted Successfully.',
            styleClass: 'bg-white border-none',
          });
          this.resetFormAndState();
        },
      });
    }
  }

  private resetFormAndState(): void {
    this.isAdding = false;
    this.vendorForm.reset({}, { emitEvent: false });
    this.vendorForm.get('id_vend')?.disable();
  }
}
