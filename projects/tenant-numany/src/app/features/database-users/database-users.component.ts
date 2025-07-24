import { Component, OnInit } from '@angular/core';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { DropdownModule } from 'primeng/dropdown';
import { Fieldset } from 'primeng/fieldset';
import { Checkbox } from 'primeng/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

// Custom validator function to check if passwords in the FormArray match
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('0')?.value;
  const repeatPassword = control.get('1')?.value;
  // If passwords are not empty and they don't match, return a 'mismatch' error.
  return newPassword && repeatPassword && newPassword !== repeatPassword
    ? { mismatch: true }
    : null;
}

@Component({
  selector: 'tenant-database-users',
  // Note: Added CommonModule for *ngIf directive
  imports: [
    CommonModule,
    SharedPanelContainerComponent,
    DropdownModule,
    Fieldset,
    CustomInputComponent,
    Checkbox,
    ReactiveFormsModule,
    Button,
  ],
  templateUrl: './database-users.component.html',
  styleUrl: './database-users.component.css',
})
export class DatabaseUsersComponent implements OnInit {
  databaseUserForm!: FormGroup;
  databaseUsersOptions = [
    { label: 'IBS, Inc.', value: 'ibs, inc' },
    { label: 'IBS, Inc.', value: 'ibs, inc' },
    { label: 'IBS, Inc.', value: 'ibs, inc' },
    { label: 'IBS, Inc.', value: 'ibs, inc' },
  ];

  roleTypeOptions = [
    { label: 'Pharmacist', value: 'rolePharmacist' },
    { label: 'Technician', value: 'roleTechnician' },
    { label: 'Admin', value: 'roleAdmin' },
    { label: 'Auditor', value: 'roleAuditor' },
    { label: 'Manager', value: 'roleManager' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.databaseUserForm = this.fb.group({
      txtLogin: ['', Validators.required],
      txtName: ['', Validators.required],
      txtInitials: [''],
      txtID_External: [''],
      tdbcRole: [null, Validators.required], // Set to null for placeholder
      tdbcRoleInitials: [null, Validators.required], // Added for the second dropdown
      txtOldPwd: ['', Validators.required],
      txtpwd: this.fb.array(
        [this.fb.control('', Validators.required), this.fb.control('', Validators.required)],
        { validators: passwordsMatchValidator }, // Apply the custom validator here
      ),
      chkSU: [false],
      chkPWExp: [false],
    });
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.databaseUserForm.controls;
  }

  // Getter for easy access to the password FormArray
  get passwordArray() {
    return this.databaseUserForm.get('txtpwd') as FormArray;
  }
}
