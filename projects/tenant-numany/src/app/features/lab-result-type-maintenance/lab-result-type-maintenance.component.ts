import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomInputComponent } from 'shared-ui';

@Component({
  selector: 'tenant-lab-result-type-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    Card,
    DividerModule,
    TextareaModule,
    CheckboxModule,
    CustomInputComponent
  ],
  templateUrl: './lab-result-type-maintenance.component.html',
  styleUrls: ['./lab-result-type-maintenance.component.css']
})
export class LabResultTypeMaintenanceComponent implements OnInit {
  labForm!: FormGroup;

  labTypes = [
    { name: 'Option1' },
    { name: 'Option2' },
    { name: 'Option3' },
    { name: 'Option4' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.labForm = this.fb.group({
      selectedLabType: [null],
      labId: ['', [Validators.required, Validators.maxLength(20)]],
      hostId: ['', [Validators.maxLength(20)]],
      units: ['', [Validators.maxLength(20)]],
      notes: ['', [Validators.maxLength(50)]],
      low: ['', Validators.pattern(/^-?\d*\.?\d+$/)],
      high: ['', Validators.pattern(/^-?\d*\.?\d+$/)],
      includeOnReport: [false]
    });
  }

  onSubmit(): void {
    if (this.labForm.invalid) {
      alert('Please correct the validation errors.');
      return;
    }

    console.log('Submitted:', this.labForm.value);
  }

  onUpdate(): void {
    if (!this.labForm.valid) {
      alert('Please fill all required fields.');
      return;
    }
    alert('Update logic here...');
    // Example: PUT call
  }

  onNew(): void {
    this.labForm.reset({
      includeOnReport: false
    });
  }

  onDelete(): void {
    const labId = this.labForm.get('labId')?.value;
    if (labId === 'SCR') {
      alert('Cannot delete Lab ID "SCR".');
      return;
    }
    if (confirm('Are you sure you want to delete this lab type?')) {
      alert('Deleted.');
      // DELETE logic
      this.labForm.reset();
    }
  }
}
