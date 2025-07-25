import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { Fieldset } from 'primeng/fieldset';
import { Select } from 'primeng/select';

@Component({
  selector: 'tenant-standing-orders',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SharedPanelContainerComponent,
    Fieldset,
    CustomInputComponent,
    Select,
  ],
  templateUrl: './standing-orders.component.html',
})
export class StandingOrdersComponent implements OnInit {
  form!: FormGroup;

  stordOptions = [
    { label: 'AMP2IV', value: 'AMP2IV' },
    { label: 'AMP2IV', value: 'AMP2IV' },
    { label: 'AMP2IV', value: 'AMP2IV' },
    { label: 'AMP2IV', value: 'AMP2IV' },
    { label: 'AMP2IV', value: 'AMP2IV' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      so_id: [''],
      rph_id: [''],
      so_ord1: [null],
      so_ord2: [null],
      so_ord3: [null],
      so_ord4: [null],
      so_ord5: [null],
      so_ord6: [null],
      so_ord7: [null],
      so_ord8: [null],
      so_ord9: [null],
      so_ord10: [null],
      so_ord11: [null],
      so_ord12: [null],
      so_ord13: [null],
      so_ord14: [null],
      so_ord15: [null],
      so_ord16: [null],
      so_ord17: [null],
      so_ord18: [null],
      so_ord19: [null],
      so_ord20: [null],
      so_ord21: [null],
      so_ord22: [null],
      so_ord23: [null],
      so_ord24: [null],
      so_ord25: [null],
    });
  }
}
