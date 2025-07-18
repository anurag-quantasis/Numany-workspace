import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  RequiredValidator,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'tenant-patient-payor-type-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
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
    { name: 'Inactive Records', code: 'INACTIVE' },
  ];

  chargeClassLookup = [
    { label: 'GEN01', value: 'GEN01' },
    { label: 'VIP01', value: 'VIP01' },
    { label: 'MED01', value: 'MED01' },
    { label: 'CC01', value: 'CC01' }
  ];

  existingPayorIDs = ['A001', 'B002', 'C003'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedOption: [null],
      idpay: [
        '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(4),
            Validators.pattern(/^[A-Za-z0-9]{1,4}$/),
          ],
          asyncValidators: [this.validateUniqueID()],
          updateOn: 'blur',
        },
      ],
      nampay: ['', [Validators.required, Validators.maxLength(50)]],
      iadpy: ['', Validators.maxLength(80)],
      ictpy: ['', Validators.maxLength(30)],
      istpy: ['', Validators.maxLength(2)],
      izppy: ['', Validators.maxLength(10)],
      iphpy: [
        '',
        [Validators.pattern(/^[0-9]{10}$/), Validators.minLength(14), Validators.maxLength(14)],
      ],
      imspy: ['', Validators.maxLength(80)],
      ipycb: ['', [Validators.maxLength(2), Validators.pattern(/^(AV|AW|CC|PC)?$/)]],
      iccpy: ['', Validators.maxLength(6) ],

      medErrorSeverity: [''],
      medErrorClass: [''],
    });

    this.form.get('selectedOption')?.valueChanges.subscribe((selected) => {
      if (selected?.name && selected?.code) {
        this.form.patchValue({
          idpay: selected.code.slice(0, 4).toUpperCase(),
          nampay: selected.name,
        });
      }
    });
  }

  validateUniqueID(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return of(this.existingPayorIDs.includes(control.value)).pipe(
        delay(500),
        map((isTaken) => (isTaken ? { idExists: true } : null)),
      );
    };
  }

  onAdd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    const chargeClass = this.form.get('iccpy')?.value;
    if (!this.chargeClassLookup.find(c => c.value === chargeClass)) {
      alert('Invalid charge class. Please select a valid one.');
      return;
    }

    console.log('Payor Added:', this.form.value);
    alert('Payor added successfully (simulated)');
    this.form.reset();
  }

  onUpdate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fix form errors before updating.');
      return;
    }

    const chargeClass = this.form.get('iccpy')?.value;
    if (!this.chargeClassLookup.find(c => c.value === chargeClass)) {
      alert('Invalid charge class. Please select a valid one.');
      return;
    }

    console.log('Payor Updated:', this.form.value);
    alert('Payor updated successfully (simulated)');
  }

  onDelete(): void {
    const id = this.form.get('idpay')?.value;
    if (!id) {
      alert('Enter a valid Payor ID to delete.');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete Payor ID: ${id}?`);
    if (confirmDelete) {
      console.log('Payor Deleted:', id);
      alert('Payor deleted successfully (simulated)');
      this.form.reset();
    }
  }
}
