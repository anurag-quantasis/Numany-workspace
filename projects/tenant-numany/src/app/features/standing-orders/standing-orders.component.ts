import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent } from 'shared-ui';
import { Fieldset } from "primeng/fieldset";

@Component({
  selector: 'tenant-standing-orders',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SharedPanelContainerComponent,
    Fieldset
],
  templateUrl: './standing-orders.component.html',
})
export class StandingOrdersComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isAddMode = false;

  records: any[] = [];
  selectedIndex = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const formGroupObj: { [key: string]: any } = {};
    for (let i = 1; i <= 25; i++) {
      formGroupObj['field' + i] = [''];
    }

    this.form = this.fb.group(formGroupObj);
  }

  addClicked(): void {
    this.form.reset();
    this.isAddMode = true;
    this.isEdit = false;
  }

  editClicked(): void {
    if (this.records.length > 0) {
      this.isEdit = true;
      this.isAddMode = false;
    } else {
      alert('No record selected to edit.');
    }
  }

  deleteClicked(): void {
    if (this.records.length === 0) {
      alert('No record to delete.');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      this.records.splice(this.selectedIndex, 1);
      alert('Record deleted');

      if (this.records.length > 0) {
        this.selectedIndex = 0;
        this.form.patchValue(this.records[0]);
      } else {
        this.form.reset();
      }

      this.isEdit = false;
    }
  }

  refreshClicked(): void {
    if (this.records.length > 0) {
      this.form.patchValue(this.records[this.selectedIndex]);
    } else {
      this.form.reset();
    }

    this.isEdit = false;
    this.isAddMode = false;
  }

  updateClicked(): void {
    if (this.form.valid) {
      const updated = this.form.value;

      if (this.isAddMode) {
        this.records.push(updated);
        this.selectedIndex = this.records.length - 1;
        alert('Record added');
      } else if (this.isEdit) {
        this.records[this.selectedIndex] = updated;
        alert('Record updated');
      }

      this.isAddMode = false;
      this.isEdit = false;
    } else {
      alert('Form is invalid. Please fill all required fields.');
    }
  }

  cancelClicked(): void {
    this.refreshClicked();
  }

  pasteClicked(): void {
    alert('Paste clicked');
    // Implement clipboard paste logic here if needed
  }

  cleanUpClicked(): void {
    alert('CleanUp STDORD clicked');
    // You can add your cleanup logic here
  }
}
