import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomInputComponent } from "shared-ui";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tenant-discharge',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    CustomInputComponent,
    ButtonModule
],
  templateUrl: './discharge.component.html',
  styleUrl: './discharge.component.css'
})
export class DischargeComponent {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      dischargeDate: [''],
      dcActive: [false]
    });
  }
}
