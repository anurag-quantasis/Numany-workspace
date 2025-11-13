import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tenant-admit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule],
  templateUrl: './admit.component.html',
  styleUrl: './admit.component.css',
})
export class AdmitComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      admit: this.fb.array([
        this.fb.group({ bedId: 'B001', name: 'Patient A' }),
        this.fb.group({ bedId: 'B002', name: 'Patient B' }),
        this.fb.group({ bedId: 'B003', name: 'Patient C' }),
      ]),
    });
  }

  get admitRows(): FormArray {
    return this.form.get('admit') as FormArray;
  }
}
