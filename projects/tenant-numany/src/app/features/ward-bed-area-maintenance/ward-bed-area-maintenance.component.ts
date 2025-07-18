import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedPanelContainerComponent } from 'shared-ui';
import { ButtonModule } from 'primeng/button';
import { Fieldset } from "primeng/fieldset";
import { CustomInputComponent } from 'shared-ui';

@Component({
  selector: 'tenant-ward-bed',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    CheckboxModule,
    SharedPanelContainerComponent,
    ButtonModule,
    Fieldset,
    CustomInputComponent
],
  templateUrl: './ward-bed-area-maintenance.component.html',
})
export class WardBedAreaMaintenanceComponent implements OnInit {
  wardBedForm!: FormGroup;

  options = [
    { name: 'Option 1' },
    { name: 'Option 2' },
    { name: 'Option 3' },
    { name: 'Option 4' },
  ];

  optionsOne = [
    { name: 'Option 1' },
    { name: 'Option 2' },
    { name: 'Option 3' },
    { name: 'Option 4' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.wardBedForm = this.fb.group({
      selectedOption: [null],
      wardArea: [''],
      costBase: [''],
      selectedOptionOne: [null],
      prnMeds: [false],
      scheduledMeds: [false],
      ivMeds: [false],
    });
  }
}
