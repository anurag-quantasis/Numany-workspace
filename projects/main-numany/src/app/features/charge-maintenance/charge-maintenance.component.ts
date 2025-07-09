import { Component, inject, OnInit, signal } from '@angular/core';
import { ChargeParameter } from './charge-maintenance-store/charge-maintenance.model';
import { ChargeMaintenanceStore } from './charge-maintenance-store/charge-maintenance.store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { CustomInputComponent } from 'shared-ui';

@Component({
  selector: 'app-charge-maintenance',
  templateUrl: './charge-maintenance.component.html',
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, NgIf, CustomInputComponent],
  providers: [ChargeMaintenanceStore],
})
export class ChargeMaintenanceComponent implements OnInit {
  form!: FormGroup;
  store = inject(ChargeMaintenanceStore);
  editableRecord = signal<ChargeParameter | null>(null);
  isEdit: boolean = false;
  fb: NonNullableFormBuilder;
  constructor(fb: NonNullableFormBuilder) {
    this.fb = fb;
    this.store.loadMockData();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      className: [''],
    });
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
