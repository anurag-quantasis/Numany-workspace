import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ShortcutDirective, SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tenant-departments',
  standalone: true, // Assuming this is a standalone component
  imports: [
    CommonModule, // Add CommonModule for *ngIf
    SelectModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ShortcutDirective,
    SharedPanelContainerComponent,
    CustomInputComponent,
    FieldsetModule,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  departmentForm!: FormGroup;
  departmentOptions = [
    { id: 1, name: '1ST DEPT', value: '1st dept' },
    { id: 2, name: 'IBS, INC', value: 'ibs, inc' },
    { id: 3, name: 'Mid Wives', value: 'mid wives' },
    { id: 4, name: 'NEW DEPARTMENT', value: 'new department' },
    { id: 5, name: 'WASTED MEDS', value: 'wasted meds' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      department: ['', Validators.required],
      id: ['', [Validators.required, Validators.maxLength(6)]],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      address: ['', Validators.maxLength(80)],
      city: ['', Validators.maxLength(50)],
      state: [''],
      zip: [null, Validators.maxLength(10)],
      phone: ['', Validators.maxLength(20)],
      note: ['', Validators.maxLength(50)],
      cost_basis: [''],
      markup: [''],
      tax_flag: [''],
    });

    // Note: The 'id' and 'name' controls should probably be disabled
    // if you always want them to be populated from the dropdown.
    // this.departmentForm.get('id')?.disable();
    // this.departmentForm.get('name')?.disable();

    this.departmentForm.get('department')!.valueChanges.subscribe((selectedId) => {
      const selectedDept = this.departmentOptions.find((dept) => dept.id === selectedId);
      if (selectedDept) {
        this.departmentForm.patchValue({
          id: selectedDept.id,
          name: selectedDept.name,
        });
      } else {
        this.departmentForm.patchValue({ id: '', name: '' });
      }
    });
  }

  printForm(): void {
    if (this.departmentForm.valid) {
      console.log(this.departmentForm.value);
      alert('Form Submitted! Check console for data.');
    } else {
      console.error('Form is invalid');
      this.departmentForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.departmentForm.reset();
  }
}
