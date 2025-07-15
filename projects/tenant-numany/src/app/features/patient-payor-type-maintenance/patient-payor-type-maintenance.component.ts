import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { Select } from "primeng/select";

@Component({
  selector: 'app-patient-payor-type-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    Card,
    CustomInputComponent,
    ButtonModule,
    Select,
    SharedPanelContainerComponent
],
  templateUrl: './patient-payor-type-maintenance.component.html',
})
export class PatientPayorTypeMaintenanceComponent implements OnInit {
  form!: FormGroup;

  dropdownOptions = [
    { name: 'All Records', code: 'ALL' },
    { name: 'Active Records', code: 'ACTIVE' },
    { name: 'Inactive Records', code: 'INACTIVE' }
  ];

  choiceOptions = [
    { choice: 'AV' },
    { choice: 'AW' },
    { choice: 'CC' },
    { choice: 'PC' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedOption: [null],
      idpay: ['', [Validators.required, Validators.maxLength(4)]],
      nampay: ['', [Validators.required, Validators.maxLength(50)]],
      iadpy: ['', Validators.maxLength(80)],
      ictpy: ['', Validators.maxLength(30)],
      istpy: ['', Validators.maxLength(2)],
      izppy: ['', Validators.maxLength(10)],
      iphpy: ['', Validators.maxLength(14)],
      imspy: ['', Validators.maxLength(80)],
      ipycb: ['', [Validators.maxLength(2), Validators.pattern(/^(AV|AW|CC|PC)?$/)]],
      iccpy: ['', Validators.maxLength(6)],
      nonemarpay: [false],
      choiceOption: [null]
    });
  }

  onAdd(): void {
    if (this.form.valid) {
      console.log('✅ Simulated Add:', this.form.value);
      alert('Payor added successfully (simulated)');
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
      alert('❌ Please fill all required fields correctly.');
    }
  }

  onUpdate(): void {
    if (this.form.valid) {
      console.log('✅ Simulated Update:', this.form.value);
      alert('Payor updated successfully (simulated)');
    } else {
      this.form.markAllAsTouched();
      alert('❌ Please fix form errors before updating.');
    }
  }

  onDelete(): void {
    const id = this.form.get('idpay')?.value;
    if (!id) {
      alert('❌ Enter a valid Payor ID to delete.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete Payor ID: ${id}?`);
    if (confirmDelete) {
      console.log('🗑️ Simulated Delete for ID:', id);
      alert('Payor deleted successfully (simulated)');
      this.form.reset();
    }
  }
}
