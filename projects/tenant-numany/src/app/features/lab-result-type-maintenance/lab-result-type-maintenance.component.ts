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
import { CustomInputComponent } from "shared-ui";

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
      labId: ['', Validators.required],
      hostId: ['', Validators.required],
      units: ['', Validators.required],
      notes: [''],
      low: [''],
      high: [''],
      includeOnReport: [false]
    });
  }

  onSubmit(): void {
    console.log('Form Data:', this.labForm.value);
  }
}
