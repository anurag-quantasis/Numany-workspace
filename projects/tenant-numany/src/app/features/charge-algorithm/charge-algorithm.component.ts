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
  isAddMode = false; // New state to track if we are in add mode
  fb: NonNullableFormBuilder;
  initialIndex = 0;

  constructor(fb: NonNullableFormBuilder) {
    this.fb = fb;
    effect(() => {
      const records = this.store.records();
      if (records.length > 0 && !this.isAddMode) {
        // Only patch if not in add mode
        this.store.selectRecord(this.initialIndex);
        this.form.patchValue(records[this.initialIndex]);
      } else if (records.length === 0 && !this.isAddMode) {
        this.form.reset();
      }
    });

    // When selectedIndex changes, update the form with the current record
    effect(() => {
      const record = this.store.currentRecord();
      if (record && !this.isEdit && !this.isAddMode) {
        // Only patch if not in edit or add mode
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
    this.isAddMode = true; // Set add mode to true
    this.isEdit = false; // Ensure edit mode is false
    this.form.reset();
    // Set all numeric fields to 0 for a clean new record
    Object.keys(this.form.controls).forEach((key) => {
      if (
        typeof this.form.controls[key].value === 'number' ||
        this.form.controls[key].value === null
      ) {
        this.form.controls[key].setValue(0);
      } else {
        this.form.controls[key].setValue(''); // Clear string fields too
      }
    });
  }

  editClicked() {
    this.isEdit = true;
    this.isAddMode = false; // Ensure add mode is false
    const record = this.store.currentRecord();
    if (record) this.form.patchValue(record);
  }

  updateClicked() {
    if (this.form.valid) {
      const formData = this.form.value as ChargeParameters;

      if (this.isAddMode) {
        // If in add mode, call the addChargeParameter API
        this.store.addChargeParameter(formData);
      } else if (this.isEdit) {
        // If in edit mode, call the updateChargeParameter API
        const record = this.store.currentRecord();
        if (record) {
          this.store.updateChargeParameter({
            id: record.id,
            data: { ...record, ...formData },
          });
        }
      }
      this.isEdit = false; // Exit edit mode
      this.isAddMode = false; // Exit add mode
    }
  }

  // The saveClicked method is now redundant and can be removed,
  // as updateClicked handles both add and edit scenarios.
  // saveClicked() { ... }

  deleteClicked() {
    const record = this.store.currentRecord();
    if (record) {
      this.store.deleteChargeParameter(record.id);
      this.isEdit = false;
      this.isAddMode = false;
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
      this.form.patchValue(record); // Revert to the last selected record's data
    } else {
      this.form.reset(); // If no records, just clear the form
    }
  }

  prevRecord() {
    const idx = this.store.selectedIndex();
    if (idx > 0) {
      this.store.selectRecord(idx - 1);
      this.isEdit = false;
      this.isAddMode = false; // Exit add mode when navigating
    }
  }

  nextRecord() {
    const idx = this.store.selectedIndex();
    if (idx < this.store.records().length - 1) {
      this.store.selectRecord(idx + 1);
      this.isEdit = false;
      this.isAddMode = false; // Exit add mode when navigating
    }
  }
}
