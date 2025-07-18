import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Fieldset } from "primeng/fieldset";
import { SharedPanelContainerComponent } from "shared-ui";
import { CustomInputComponent } from 'shared-ui';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'tenant-pharmcist-intervention-type',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    // Fieldset,
    SharedPanelContainerComponent,
    // CustomInputComponent,
    SelectModule,
    Fieldset
],
  templateUrl: './pharmcist-intervention-type.component.html',
  styleUrls: ['./pharmcist-intervention-type.component.css'],
})
export class PharmcistInterventionTypeComponent {
  interventionForm: FormGroup;

interventionOptions = [
  { id: 'ADR', name: 'Adverse Drug Reaction' },
  { id: 'Allergy', name: 'Allergy to a medication' },
  { id: 'BPMH', name: 'BEST POSSIBLE MEDICATION HISTOF' },
  { id: 'CR', name: 'Chart Review' }
];


  // interventionOptions = [
  //   { desc: 'Adverse Drug Reaction', id: 'ADR' },
  //   { desc: 'Allergy to a medication', id: 'Allergy' },
  //   { desc: 'BEST POSSIBLE MEDICATION HISTOF', id: 'BPMH' },
  //   { desc: 'Chart Review', id: 'CR' }
  // ];

  selectedIntervention: any;

  activityOptions: any[] = [];


  constructor(private fb: FormBuilder) {
    this.interventionForm = this.fb.group({
      selectedIntervention: [null, Validators.required],
      selectedActivity: [null], // Optional

      PI_ID: ['', [Validators.required, Validators.maxLength(10)]],
      Description: ['', [Validators.required, Validators.maxLength(50)]],
      costImpact: [''],
      PI_Hide: [false],

      // Checkbox controls
      SL_ME: [false],
      CL_ME: [false],
      SC_ME: [false],
      PC_ME: [false],
      SL_ADR: [false],
      ADRType: [false],
      Acuity: [false],
      FI: [false],
      OC: [false],
    });
  }

  onInterventionSelect() {
    console.log('Intervention selected:', this.interventionForm.get('selectedIntervention')?.value);
  }

  onUpdate() {
    if (this.interventionForm.valid) {
      console.log('Update clicked', this.interventionForm.value);
    } else {
      this.interventionForm.markAllAsTouched();
      console.warn('Form is invalid');
    }
  }

  onDelete() {
    console.log('Delete clicked');
  }

  onNew() {
    console.log('New clicked');
    this.interventionForm.reset();
  }
}
