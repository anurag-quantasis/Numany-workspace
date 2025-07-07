import { Component, inject, signal } from '@angular/core';
import { ChargeParameter } from './charge-maintenance-store/charge-maintenance.model';
import { ChargeMaintenanceStore } from './charge-maintenance-store/charge-maintenance.store';
import { CustomInputComponent } from '@shared-ui/components/form-components/custom-input/custom-input.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-charge-maintenance',
  templateUrl: './charge-maintenance.component.html',
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, CustomInputComponent, NgIf],
  providers: [ChargeMaintenanceStore],
})
export class ChargeMaintenanceComponent {
  form!: FormGroup;
  store = inject(ChargeMaintenanceStore);
  editableRecord = signal<ChargeParameter | null>(null);
  isEdit: boolean = false;

  constructor() {
    this.store.loadMockData();
  }

  enterEdit() {
    const current = this.store.currentRecord();
    this.editableRecord.set(current ? structuredClone(current) : null);
    this.store.toggleEditMode(true);
  }

  cancelEdit() {
    this.store.toggleEditMode(false);
    this.editableRecord.set(null);
  }

  update() {
    const updated = this.editableRecord();
    if (updated) {
      this.store.updateRecord(updated);
      this.editableRecord.set(null);
    }
  }

  editClicked() {
    this.isEdit = true;
  }

  updateClicked() {
    this.isEdit = false;
  }
}
