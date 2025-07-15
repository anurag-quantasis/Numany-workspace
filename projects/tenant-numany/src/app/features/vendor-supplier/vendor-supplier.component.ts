import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tenant-vendor-supplier',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    DividerModule,
    InputTextModule,
    CardModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './vendor-supplier.component.html',
  styleUrls: ['./vendor-supplier.component.css']
})
export class VendorSupplierComponent implements OnInit {
  vendorForm!: FormGroup;
  vendors: any[] = [];
  editingIndex: number | null = null;

  cities = [
    { name: 'Option1' }, { name: 'Option2' }, { name: 'Option3' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.vendorForm = this.fb.group({
      selectedCity: [null, Validators.required],
      vendorId: ['', [Validators.required, Validators.maxLength(12), this.vendorExistsValidator.bind(this)]],
      accountNo: ['', Validators.maxLength(12)],
      vendorName: ['', [Validators.required, Validators.maxLength(50)]],
      vendorMtd: ['', Validators.pattern(/^-?\\d*(\\.\\d+)?$/)],
      vendorYtd: ['', Validators.pattern(/^-?\\d*(\\.\\d+)?$/)],
      remarks: ['', Validators.maxLength(100)]
    });
  }

  vendorExistsValidator(control: AbstractControl): ValidationErrors | null {
    if (this.editingIndex === null && this.vendors.some(v => v.vendorId === control.value)) {
      return { vendorExists: true };
    }
    return null;
  }

  onAdd(): void {
    if (this.vendorForm.valid) {
      this.vendors.push({ ...this.vendorForm.value });
      console.log('Vendor added:', this.vendorForm.value);
      this.vendorForm.reset();
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }

  onUpdate(): void {
    if (this.vendorForm.valid && this.editingIndex !== null) {
      this.vendors[this.editingIndex] = { ...this.vendorForm.value };
      console.log('Vendor updated:', this.vendorForm.value);
      this.vendorForm.reset();
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
        this.editingIndex = null;
        console.log('Vendor deleted');
      }
    }
  }

  onRefresh(): void {
    this.vendorForm.reset();
    this.editingIndex = null;
    console.log('Form reset');
  }

  onEditVendor(index: number): void {
    this.editingIndex = index;
    this.vendorForm.patchValue(this.vendors[index]);
  }
}
