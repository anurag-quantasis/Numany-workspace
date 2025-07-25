import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tenant-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      transfers: this.fb.array([
        this.fb.group({ bedId: 'B001', name: 'Tenant A' }),
        this.fb.group({ bedId: 'B002', name: 'Tenant B' }),
        this.fb.group({ bedId: 'B003', name: 'Tenant C' })
      ])
    });
  }

  get transfersArray(): FormArray {
    return this.form.get('transfers') as FormArray;
  }
}
