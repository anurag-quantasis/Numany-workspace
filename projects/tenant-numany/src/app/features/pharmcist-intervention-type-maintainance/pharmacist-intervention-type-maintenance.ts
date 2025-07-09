import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

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
    CommonModule,
  ],
  templateUrl: './pharmcist-intervention-type-maintainance.component.html',
  styleUrls: ['./pharmcist-intervention-type-maintainance.component.css']
})
export class PharmcistInterventionTypeMaintainanceComponent {
  // interventionForm: FormGroup;

  // interventions = [
  //   { id: 'O1', name: 'Option 1', description: 'Activity A', isHidden: false, checkbox1: true, checkbox2: false, checkbox3: true, costImpact: '' },
  //   { id: 'O2', name: 'Option 2', description: 'Activity B', isHidden: false, checkbox1: false, checkbox2: true, checkbox3: false, costImpact: '' }
  // ];

  // interventionOptions = this.interventions.map(i => ({ name: i.name, code: i.id }));

  // checkboxList = [
  //   { label: 'Checkbox 1', controlName: 'checkbox1' },
  //   { label: 'Checkbox 2', controlName: 'checkbox2' },
  //   { label: 'Checkbox 3', controlName: 'checkbox3' },
  // ];

  // constructor(private fb: FormBuilder) {
  //   this.interventionForm = this.fb.group({
  //     selectedIntervention: [null],
  //     interventionId: [''],
  //     description: [''],
  //     isHidden: [false],
  //     costImpact: [''],
  //     checkbox1: [false],
  //     checkbox2: [false],
  //     checkbox3: [false],
  //   });
  // }

  // // Load intervention data when dropdown changes
  // onInterventionSelect() {
  //   const selectedCode = this.interventionForm.value.selectedIntervention?.code;
  //   const intervention = this.interventions.find(i => i.id === selectedCode);

  //   if (intervention) {
  //     this.interventionForm.patchValue({
  //       interventionId: intervention.id,
  //       description: intervention.description,
  //       isHidden: intervention.isHidden,
  //       costImpact: intervention.costImpact,
  //       checkbox1: intervention.checkbox1,
  //       checkbox2: intervention.checkbox2,
  //       checkbox3: intervention.checkbox3,
  //     });
  //   } else {
  //     this.onNew();
  //   }
  // }

  // onNew() {
  //   this.interventionForm.reset({
  //     selectedIntervention: null,
  //     interventionId: '',
  //     description: '',
  //     isHidden: false,
  //     costImpact: '',
  //     checkbox1: false,
  //     checkbox2: false,
  //     checkbox3: false,
  //   });
  // }

  // onDelete() {
  //   const selectedCode = this.interventionForm.value.selectedIntervention?.code;
  //   if (!selectedCode) {
  //     alert('Please select an intervention to delete.');
  //     return;
  //   }
  //   const index = this.interventions.findIndex(i => i.id === selectedCode);
  //   if (index > -1) {
  //     this.interventions.splice(index, 1);
  //     this.interventionOptions = this.interventions.map(i => ({ name: i.name, code: i.id }));
  //     alert('Intervention deleted.');
  //     this.onNew();
  //   }
  // }

  // onUpdate() {
  //   const formValue = this.interventionForm.value;

  //   if (!formValue.interventionId) {
  //     alert('Please enter an ID.');
  //     return;
  //   }

  //   const existing = this.interventions.find(i => i.id === formValue.interventionId);

  //   if (existing) {
  //     existing.description = formValue.description;
  //     existing.isHidden = formValue.isHidden;
  //     existing.checkbox1 = formValue.checkbox1;
  //     existing.checkbox2 = formValue.checkbox2;
  //     existing.checkbox3 = formValue.checkbox3;
  //     existing.costImpact = formValue.costImpact;
  //     alert('Intervention updated.');
  //   } else {
  //     this.interventions.push({
  //       id: formValue.interventionId,
  //       name: formValue.selectedIntervention?.name || 'New Option',
  //       description: formValue.description,
  //       isHidden: formValue.isHidden,
  //       checkbox1: formValue.checkbox1,
  //       checkbox2: formValue.checkbox2,
  //       checkbox3: formValue.checkbox3,
  //       costImpact: formValue.costImpact,
  //     });
  //     this.interventionOptions = this.interventions.map(i => ({ name: i.name, code: i.id }));
  //     alert('New intervention added.');
  //   }
  // }

  interventionForm: FormGroup;

  interventionOptions = [
    { name: 'Option 1', code: 'O1' },
    { name: 'Option 2', code: 'O2' }
  ];

  activityOptions = [
    { name: 'Activity A', code: 'A1' },
    { name: 'Activity B', code: 'A2' }
  ];

  constructor(private fb: FormBuilder) {
    this.interventionForm = this.fb.group({
      selectedIntervention: [''],
      selectedActivity: [''],
      isHidden: [false],
      interventionId: [''],
      description: [''],
      costImpact: ['']
    });
  }
}
