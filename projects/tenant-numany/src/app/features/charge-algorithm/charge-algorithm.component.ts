import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from 'shared-ui';
import { ChargeMaintenanceStore } from './charge-algorithm-store/charge-algorithm.store';
import { ChargeParameters } from './charge-algorithm-store/charge-algorithm.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'tenant-charge-algorithm',
  templateUrl: './charge-algorithm.component.html',
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, CommonModule, CustomInputComponent],
  providers: [ChargeMaintenanceStore, MessageService],
})
export class ChargeAlgorithmComponent implements OnInit {
  form!: FormGroup;
  store = inject(ChargeMaintenanceStore);
  isEdit = false;
  fb: NonNullableFormBuilder;
  initialIndex = 0;

  constructor(fb: NonNullableFormBuilder) {
    this.fb = fb;
    effect(() => {
      const records = this.store.records();
      if (records.length > 0) {
        this.store.selectRecord(this.initialIndex);
        this.form.patchValue(records[this.initialIndex]);
      } else {
        this.form.reset();
      }
    });

    // When selectedIndex changes, update the form with the current record
    effect(() => {
      const record = this.store.currentRecord();
      if (record && !this.isEdit) {
        this.form.patchValue(record);
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      ichid: [''],
      namcls: [''],
      lo1: [0],
      hi1: [0],
      fee1: [0],
      markup1: [0],
      minchrg1: [0],
      lo2: [0],
      hi2: [0],
      fee2: [0],
      markup2: [0],
      minchrg2: [0],
      lo3: [0],
      hi3: [0],
      fee3: [0],
      markup3: [0],
      minchrg3: [0],
      lo4: [0],
      hi4: [0],
      fee4: [0],
      markup4: [0],
      minchrg4: [0],
      lo5: [0],
      hi5: [0],
      fee5: [0],
      markup5: [0],
      minchrg5: [0],
    });

    // Load all records and display the first one
    this.store.loadChargeParameters();
  }

  addClicked() {
    this.isEdit = false;
    this.form.reset();
    // Optionally set all numeric fields to 0
    Object.keys(this.form.controls).forEach((key) => {
      if (typeof this.form.controls[key].value === 'number') {
        this.form.controls[key].setValue(0);
      }
    });
  }

  editClicked() {
    this.isEdit = true;
    const record = this.store.currentRecord();
    if (record) this.form.patchValue(record);
  }

  updateClicked() {
    if (this.form.valid) {
      const record = this.store.currentRecord();
      if (record) {
        this.store.updateChargeParameter({
          id: record.id,
          data: { ...record, ...this.form.value },
        });
        this.isEdit = false;
      }
    }
  }

  saveClicked() {
    if (this.form.valid) {
      const formData = this.form.value as ChargeParameters; // Cast to your model

      if (this.isEdit && this.store.currentRecord()?.id) {
        // If isEdit and there's an ID, it's an update
        const recordId = this.store.currentRecord()!.id;
        this.store.updateChargeParameter({
          id: recordId,
          data: { ...this.store.currentRecord(), ...formData },
        });
      } else {
        // Otherwise, it's an add operation
        this.store.addChargeParameter(formData);
      }
      this.isEdit = false; // Exit edit/add mode after saving
    }
  }

  deleteClicked() {
    const record = this.store.currentRecord();
    if (record) {
      this.store.deleteChargeParameter(record.id);
      // After deletion, go to the first record (handled by effect on records)
    }
  }

  refreshClicked() {
    this.store.loadChargeParameters();
    this.store.selectRecord(this.initialIndex);
  }

  cancelClicked() {
    this.isEdit = false;
    const record = this.store.currentRecord();
    if (record) this.form.patchValue(record);
  }

  prevRecord() {
    const idx = this.store.selectedIndex();
    if (idx > 0) {
      this.store.selectRecord(idx - 1);
      this.isEdit = false; // Crucial: Exit edit mode so the form patches
    }
  }

  nextRecord() {
    const idx = this.store.selectedIndex();
    if (idx < this.store.records().length - 1) {
      this.store.selectRecord(idx + 1);
      this.isEdit = false; // Crucial: Exit edit mode so the form patches
    }
  }
}
