import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from 'shared-ui';
import { toValue } from '@primeng/themes';

@Component({
  selector: 'tenant-pharmacist-intervention-type-maintenance',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    CustomInputComponent,
  ],
  templateUrl: './pharmacist-intervention-type-maintenance.component.html',
  styleUrl: './pharmacist-intervention-type-maintenance.component.css',
})
export class PharmacistInterventionTypeMaintenanceComponent {
  interventionForm: FormGroup;

  interventionOptions = [
    { name: 'Option 1', code: 'O1' },
    { name: 'Option 2', code: 'O2' },
  ];

  activityOptions = [
    { name: 'Activity A', code: 'A1' },
    { name: 'Activity B', code: 'A2' },
  ];

  constructor(private fb: FormBuilder) {
    this.interventionForm = this.fb.group({
      table_type: ['', Validators.required],
      item_type: [''],
      hide: [false],
      id: [''],
      description: [''],
      value: [''],
    });
  }
}
