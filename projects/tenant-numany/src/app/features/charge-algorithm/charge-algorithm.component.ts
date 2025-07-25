import { Component, inject, OnInit, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChargeMaintenanceStore } from './charge-algorithm-store/charge-algorithm.store';
import { ChargeParameters } from './charge-algorithm-store/charge-algorithm.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'tenant-charge-algorithm',
  templateUrl: './charge-algorithm.component.html',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputComponent,
    SharedPanelContainerComponent,
    ConfirmDialog,
  ],
  providers: [ChargeMaintenanceStore, ConfirmationService],
})
export class ChargeAlgorithmComponent implements OnInit {
  form!: FormGroup;
  store = inject(ChargeMaintenanceStore);
  isEdit = false;
  isAddMode = false;
  fb: NonNullableFormBuilder;
  initialIndex = 0;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  constructor(fb: NonNullableFormBuilder) {
    this.fb = fb;
    effect(() => {
      const records = this.store.records();
      if (records.length > 0 && !this.isAddMode) {
        this.store.selectRecord(this.initialIndex);
        this.form.patchValue(records[this.initialIndex]);
      } else if (records.length === 0 && !this.isAddMode) {
        this.form.reset();
      }
    });

    effect(() => {
      const record = this.store.currentRecord();
      if (record && !this.isEdit && !this.isAddMode) {
        this.form.patchValue(record);
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      ichid: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(4)]],
      namcls: ['', [Validators.required, Validators.maxLength(50)]],
      lo1: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      hi1: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fee1: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      markup1: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      minchrg1: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      lo2: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      hi2: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fee2: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      markup2: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      minchrg2: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      lo3: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      hi3: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fee3: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      markup3: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      minchrg3: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      lo4: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      hi4: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fee4: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      markup4: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      minchrg4: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      lo5: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      hi5: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fee5: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      markup5: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      minchrg5: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    });
    this.store.loadChargeParameters();
  }

  addClicked() {
    this.isAddMode = true;
    this.isEdit = false;
    this.form.reset();
    Object.keys(this.form.controls).forEach((key) => {
      if (
        typeof this.form.controls[key].value === 'number' ||
        this.form.controls[key].value === null
      ) {
        this.form.controls[key].setValue(0);
      } else {
        this.form.controls[key].setValue('');
      }
    });
  }

  editClicked() {
    this.isEdit = true;
    this.isAddMode = false;
    const record = this.store.currentRecord();
    if (record) this.form.patchValue(record);
  }

  updateClicked() {
    if (this.form.valid) {
      const formData = this.form.value as ChargeParameters;

      if (this.isAddMode) {
        this.store.addChargeParameter(formData);
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Successful',
          detail: 'Charge Parameter added successfully.',
          styleClass: 'bg-white border-none',
        });
      } else if (this.isEdit) {
        const record = this.store.currentRecord();
        if (record) {
          this.store.updateChargeParameter({
            id: record.ichid,
            data: { ...record, ...formData },
          });
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Successful',
            detail: 'Updated successfully',
            styleClass: 'bg-white border-none',
          });
        }
      }
      this.isEdit = false;
      this.isAddMode = false;
    }
  }

  deleteClicked() {
    const record = this.store.currentRecord();
    if (!record) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a charge parameter to delete.',
      });
      return;
    } else {
      this.confirmationService.confirm({
        key: 'delete-chargeParameter-confirmation',
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
        message: `Are you sure you want to delete ${record.namcls}`,
        header: 'Confirm Deletion',
        icon: 'pi pi-trash',
        accept: () => {
          this.store.deleteChargeParameter(record.ichid);
        },
      });
    }
  }

  refreshClicked() {
    this.store.loadChargeParameters();
    this.isEdit = false;
    this.isAddMode = false;
    this.store.selectRecord(this.initialIndex);
  }

  cancelClicked() {
    this.isEdit = false;
    this.isAddMode = false;
    const record = this.store.currentRecord();
    if (record) {
      this.form.patchValue(record);
    } else {
      this.form.reset();
    }
  }

  prevRecord() {
    const idx = this.store.selectedIndex();
    if (idx > 0) {
      this.store.selectRecord(idx - 1);
      this.isEdit = false;
      this.isAddMode = false;
    }
  }

  nextRecord() {
    const idx = this.store.selectedIndex();
    if (idx < this.store.records().length - 1) {
      this.store.selectRecord(idx + 1);
      this.isEdit = false;
      this.isAddMode = false;
    }
  }
}
