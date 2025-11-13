import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { PatientPayorStore } from './patient-payor-type-store/patient-payor-type.store';
import { ChargeMaintenanceStore } from '../charge-algorithm/charge-algorithm-store/charge-algorithm.store';
import { PatientPayor } from './patient-payor-type-store/patient-payor-type.model';
import { ChargeParameters } from '../charge-algorithm/charge-algorithm-store/charge-algorithm.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'tenant-patient-payor-type-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
    Select,
    CustomInputComponent,
    SharedPanelContainerComponent,
    ConfirmDialog,
  ],
  providers: [PatientPayorStore, ConfirmationService],
  templateUrl: './patient-payor-type-maintenance.component.html',
})
export class PatientPayorTypeMaintenanceComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  store = inject(PatientPayorStore);
  chargeStore = inject(ChargeMaintenanceStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  form!: FormGroup;
  isAddMode = signal(false);

  private destroy$ = new Subject<void>();
  private lastSelectedPayor: PatientPayor | null = null;

  constructor() {}

  ngOnInit(): void {
    this.store.loadPatientPayor();
    this.initializeForm();
    this.setupFormListeners();
    this.store.loadPatientPayor();
    this.chargeStore.loadChargeParameters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      selectedPayor: [{ value: null, disabled: true }],
      chargeClassSelector: [null],
      id_pay: ['', [Validators.required, Validators.maxLength(4)]],
      nam_pay: ['', [Validators.required, Validators.maxLength(50)]],
      iad_py: ['', Validators.maxLength(80)],
      ict_py: ['', Validators.maxLength(30)],
      ist_py: ['', Validators.maxLength(2)],
      izp_py: ['', Validators.maxLength(10)],
      iph_py: ['', Validators.maxLength(14)],
      imsp_py: ['', Validators.maxLength(80)],
      ipy_cb: ['', [Validators.maxLength(2), Validators.pattern(/^(AV|AW|CC|PC)?$/)]],
      icc_py: ['', Validators.maxLength(6)],
      non_emar_pay: [false],
    });
  }

  private setupFormListeners(): void {
    this.form
      .get('selectedPayor')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selected: PatientPayor | null) => {
        this.store.selectPatient(selected);
        if (selected) {
          this.form.patchValue(selected, { emitEvent: false });
          const chargeClassObject = this.chargeStore
            .records()
            .find((c) => c.ichid === selected.icc_py);

          if (chargeClassObject) {
            this.form
              .get('chargeClassSelector')
              ?.patchValue(chargeClassObject, { emitEvent: false });
          } else {
            this.form.get('chargeClassSelector')?.patchValue(null, { emitEvent: false });
          }
        } else {
          this.form.reset({ selectedPayor: null }, { emitEvent: false });
        }
      });

    this.form
      .get('chargeClassSelector')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selectedClass: ChargeParameters | null) => {
        if (selectedClass) {
          this.form.get('icc_py')?.patchValue(selectedClass.ichid);
        } else {
          this.form.get('icc_py')?.patchValue(null);
        }
      });
  }

  onAddNew(): void {
    this.lastSelectedPayor = this.form.get('selectedPayor')?.value;
    this.isAddMode.set(true);
    this.store.selectPatient(null);
    this.form.reset();
    this.form.get('id_pay')?.enable();
  }

  onCancel(): void {
    this.isAddMode.set(false);
    this.form.reset();
    if (this.lastSelectedPayor) {
      this.form.get('selectedPayor')?.setValue(this.lastSelectedPayor, { emitEvent: true });
    }
    this.lastSelectedPayor = null;
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: PatientPayor = { ...formValue };
    delete (payload as any).selectedPayor;
    delete (payload as any).chargeClassSelector;

    this.store.addNewPatient(payload);
    this.isAddMode.set(false);
    this.form.reset();
    this.messageService.add({
      key: 'custom-toast',
      severity: 'success',
      summary: 'Successful',
      detail: 'Successfully Added.',
      styleClass: 'border-none bg-white',
    });
  }

  onUpdate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select patient to update.',
        styleClass: 'border-none bg-white',
      });
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: PatientPayor = { ...formValue };
    delete (payload as any).selectedPayor;
    delete (payload as any).chargeClassSelector;

    this.store.updatePatient(payload);
    this.messageService.add({
      key: 'custom-toast',
      severity: 'success',
      summary: 'Sucessful',
      detail: 'Updated Successfully.',
      styleClass: 'border-none bg-white',
    });
  }

  onDelete(): void {
    const selected = this.store.selectedPatient();
    if (!selected) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a payor to delete.',
        styleClass: 'border-none bg-white',
      });
      return;
    }
    this.confirmationService.confirm({
      key: 'delete-payor-confirmation',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      message: `Are you sure you want to delete ${selected.nam_pay}`,
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      accept: () => {
        this.store.deletePatient(selected.id_pay);
      },
    });
    this.form.reset();
  }
}
