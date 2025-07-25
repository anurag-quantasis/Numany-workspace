import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { Select } from 'primeng/select';
import { Fieldset } from 'primeng/fieldset';
import { TenantLabStore } from './lab-store/lab-store';
import { TenantLabResultService } from './service/lab-result-type-maintenance.service';
import { highGreaterThanLowValidator } from 'shared-ui';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'tenant-lab-result-type-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    CheckboxModule,
    CustomInputComponent,
    SharedPanelContainerComponent,
    Select,
    Fieldset,
    ConfirmDialog,
  ],
  templateUrl: './lab-result-type-maintenance.component.html',
  styleUrls: ['./lab-result-type-maintenance.component.css'],
  providers: [TenantLabStore, TenantLabResultService, ConfirmationService],
})
export class LabResultTypeMaintenanceComponent implements OnInit {
  readonly store = inject(TenantLabStore);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  labForm!: FormGroup;

  isEditMode = signal(false);
  isSubmitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.labForm = this.fb.group(
      {
        selectedLabType: [null],
        id_lab: ['', [Validators.required, Validators.maxLength(20)]],
        id_host: ['', [Validators.maxLength(20)]],
        l_units: ['', [Validators.maxLength(20)]],
        nam_lab: ['', [Validators.maxLength(50)]],
        low_norm: [null, Validators.pattern(/^-?\d*\.?\d+$/)],
        hi_norm: [null, Validators.pattern(/^-?\d*\.?\d+$/)],
        inc_rpt: [false],
      },
      {
        validators: [highGreaterThanLowValidator('low_norm', 'hi_norm')],
      },
    );
    this.store.loadTenantLabResults();

    this.labForm.get('selectedLabType')?.valueChanges.subscribe((selectedId: string) => {
      const selected = this.store.tenantLabResult().find((lab) => lab.id_lab === selectedId);
      if (selected) {
        this.isEditMode.set(true);
        this.labForm.patchValue({
          id_lab: selected.id_lab,
          id_host: selected.id_host,
          l_units: selected.l_units,
          nam_lab: selected.nam_lab,
          low_norm: selected.low_norm,
          hi_norm: selected.hi_norm,
          inc_rpt: selected.inc_rpt,
        });
      } else {
        this.isEditMode.set(false);

        // Reset all form fields except selectedLabType
        this.labForm.patchValue({
          id_lab: '',
          id_host: '',
          l_units: '',
          nam_lab: '',
          low_norm: '',
          hi_norm: '',
          inc_rpt: false,
        });

        // Optionally reset selectedLabType without emitting valueChanges again
        this.labForm.get('selectedLabType')?.setValue(null, { emitEvent: false });
      }
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
    this.isSubmitted = true;
    if (!this.labForm.valid) {
      this.labForm.markAllAsTouched();
      return;
    } else {
      const updatedLabResult = this.labForm.getRawValue();
      delete updatedLabResult.selectedLabType;
      if (updatedLabResult.id_lab) {
        this.store.updateTenantLabResult(updatedLabResult);
      }
    }
  }

  onNew(): void {
    this.isSubmitted = true;
    if (this.isEditMode()) {
      this.labForm.reset();
      return;
    }

    if (!this.labForm.valid) {
      this.labForm.markAllAsTouched();
      return;
    } else {
      const newLabResult = this.labForm.getRawValue();
      delete newLabResult.selectedLabType;

      if (newLabResult.id_lab) {
        this.store.addTenantLabResult(newLabResult);
      }
    }
  }

  // onDelete(): void {
  //   const labId = this.labForm.get('labId')?.value;
  //   if (labId === 'SCR') {
  //     alert('Cannot delete Lab ID "SCR".');
  //     return;
  //   }
  //   if (confirm('Are you sure you want to delete this lab type?')) {
  //     alert('Deleted.');
  //     // DELETE logic
  //     this.labForm.reset();
  //   }
  // }

  deleteSelectedDepartment(): void {
    const labResultId = this.labForm.get('id_lab')?.value;

    if (!labResultId) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete lab result "${labResultId}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.store.deleteTenantLabResult(labResultId);
        this.labForm.reset();
      },
      reject: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  get isDeleteDisabled(): boolean {
    return !this.labForm?.get('selectedLabType')?.value;
  }
}
