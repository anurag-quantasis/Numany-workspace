import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent } from 'shared-ui';
import { CustomInputComponent } from 'shared-ui';
import { Fieldset } from "primeng/fieldset";

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
    Fieldset
],
  templateUrl: './vendor-supplier.component.html',
  styleUrls: ['./vendor-supplier.component.css'],
})
export class VendorSupplierComponent implements OnInit {
  vendorForm!: FormGroup;
  vendors: any[] = [];
  editingIndex: number | null = null;

  options = [{ name: 'Option1' }, { name: 'Option2' }, { name: 'Option3' }];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.vendorForm = this.fb.group({
      selectedOption: [null, Validators.required],

      vendorId: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.maxLength(12),
        this.vendorExistsValidator.bind(this),
      ]),

      accountNo: ['', Validators.maxLength(12)],
      vendorName: ['', [Validators.required, Validators.maxLength(50)]],

      vendorMtd: ['', Validators.pattern(/^-?\d*(\.\d+)?$/)],
      vendorYtd: ['', Validators.pattern(/^-?\d*(\.\d+)?$/)],

      remarks: ['', Validators.maxLength(100)],
    });
  }

  vendorExistsValidator(control: AbstractControl): ValidationErrors | null {
    if (this.editingIndex === null && this.vendors.some((v) => v.vendorId === control.value)) {
      return { vendorExists: true };
    }
    return null;
  }

  onAdd(): void {
    if (this.vendorForm.valid) {
      this.vendors.push({ ...this.vendorForm.getRawValue() });
      console.log('Vendor added:', this.vendorForm.value);
      this.vendorForm.reset();
      this.vendorForm.get('vendorId')?.enable();
      this.editingIndex = null;
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }

  onUpdate(): void {
    if (this.vendorForm.valid && this.editingIndex !== null) {
      this.vendors[this.editingIndex] = { ...this.vendorForm.getRawValue() };
      console.log('Vendor updated:', this.vendorForm.value);
      this.vendorForm.reset();
      this.vendorForm.get('vendorId')?.enable();
      this.editingIndex = null;
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }

  onDelete(): void {
    if (this.editingIndex !== null) {
      const confirmDelete = confirm('Are you sure you want to delete this vendor?');
      if (confirmDelete) {
        this.vendors.splice(this.editingIndex, 1);
        this.vendorForm.reset();
        this.vendorForm.get('vendorId')?.enable();
        this.editingIndex = null;
        console.log('Vendor deleted');
      }
    }
  }

  onRefresh(): void {
    this.vendorForm.reset();
    this.vendorForm.get('vendorId')?.enable();
    this.editingIndex = null;
    console.log('Form reset');
  }

  onEditVendor(index: number): void {
    this.editingIndex = index;
    this.vendorForm.patchValue(this.vendors[index]);
    this.vendorForm.get('vendorId')?.disable(); // Prevent editing vendorId
  }
}
