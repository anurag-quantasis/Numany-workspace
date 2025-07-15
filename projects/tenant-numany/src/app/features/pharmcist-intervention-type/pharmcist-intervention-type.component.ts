import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'main-pharmcist-intervention-type',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './pharmcist-intervention-type.component.html',
  styleUrls: ['./pharmcist-intervention-type.component.css']
})
export class PharmcistInterventionTypeComponent {
onInterventionSelect() {
throw new Error('Method not implemented.');
}
  // interventionForm: FormGroup;

  // interventionOptions = [
  //   { name: 'Option 1', code: 'O1' },
  //   { name: 'Option 2', code: 'O2' }
  // ];

  // activityOptions = [
  //   { name: 'Activity A', code: 'A1' },
  //   { name: 'Activity B', code: 'A2' }
  // ];

  // constructor(private fb: FormBuilder) {
  //   this.interventionForm = this.fb.group({
  //     selectedIntervention: [''],
  //     selectedActivity: [''],
  //     isHidden: [false],
  //     interventionId: [''],
  //     description: [''],
  //     costImpact: ['']
  //   });
  // }

  interventionForm: FormGroup;

  interventionOptions = [
    { name: 'Option 1' },
    { name: 'Option 2' }
  ];

  activityOptions: any[] = [];

  checkboxList = [
    { label: 'Med Error Severity', controlName: 'checkbox1' },
    { label: 'Med Error Class', controlName: 'checkbox2' },
    { label: 'Med Error Subclass', controlName: 'checkbox3' },
    { label: 'Probable Cause', controlName: 'checkbox4' },
    { label: 'ADR Severity', controlName: 'checkbox5' },
    { label: 'ADR Certainity', controlName: 'checkbox6' },
    { label: 'Acuity', controlName: 'checkbox7' },
    { label: 'Drug Impact - Financial', controlName: 'checkbox8' },
    { label: 'Intervention OutCome', controlName: 'checkbox9' },
  ];

  constructor(private fb: FormBuilder) {
    this.interventionForm = this.fb.group({
      interventionId: [''],

      selectedIntervention: [null],
      id: [''],
      description: [''],
      costImpact: [''],
      selectedActivity: [''],
      isHidden: [false],
      checkbox1: [false],
      checkbox2: [false],
      checkbox3: [false],
      checkbox4: [false],
      checkbox5: [false],
      checkbox6: [false],
      checkbox7: [false],
      checkbox8: [false],
      checkbox9: [false]
    });
  }

  onUpdate() {
    console.log('Update clicked', this.interventionForm.value);
  }

  onDelete() {
    console.log('Delete clicked');
  }

  onNew() {
    console.log('New clicked');
    this.interventionForm.reset();
  }
}
