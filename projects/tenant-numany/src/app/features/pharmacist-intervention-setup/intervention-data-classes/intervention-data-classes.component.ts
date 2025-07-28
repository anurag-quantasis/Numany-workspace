// intervention-data-classes.component.ts

import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from 'shared-ui';
import { Subscription } from 'rxjs';
import { InterventionDataClassesStore } from './intervention-data-classes-store/intervention-data-classes.store';
import { InterventionDataClasses } from './intervention-data-classes-store/intervention-data-classes.model';

@Component({
  selector: 'tenant-intervention-data-classes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    CustomInputComponent,
  ],
  templateUrl: './intervention-data-classes.component.html',
  styleUrl: './intervention-data-classes.component.css',
  providers: [InterventionDataClassesStore], // Provide the store locally to this component
})
export class InterventionDataClassesComponent implements OnInit, OnDestroy {
  // Inject services and store
  private fb = inject(FormBuilder);
  readonly store = inject(InterventionDataClassesStore);
  private subscriptions = new Subscription();

  // Component state
  interventionForm!: FormGroup;
  isNewMode = signal(false);

  // Static options for the first dropdown
  interventionOptions = [
    { name: 'Intervention Class', code: 'IC' },
    { name: 'Intervention Type', code: 'IT' },
  ];

  // Dynamic options for the activity dropdown, derived from the store state
  activityOptions = computed(() =>
    this.store.interventionDataCls().map((item) => ({
      name: `${item.ac_id} - ${item.ac_desc}`, // Display both ID and Description
      code: item.ac_id,
    })),
  );

  ngOnInit(): void {
    this.initializeForm();
    this.store.loadInterventionDataClasses();
    this.listenForActivitySelection();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.interventionForm = this.fb.group({
      table_type: ['', Validators.required],
      item_type: [''], // This will hold the selected 'ac_id'
      hide: [false],
      id: [{ value: '', disabled: true }], // ID is non-editable
      description: ['', [Validators.maxLength(255)]],
      value: [null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    });
  }

  private listenForActivitySelection(): void {
    // When the user selects an activity from the dropdown...
    const sub = this.interventionForm.get('item_type')?.valueChanges.subscribe((selectedId) => {
      if (!selectedId || this.isNewMode()) return;

      const selectedActivity = this.store.interventionDataCls().find((a) => a.ac_id === selectedId);
      if (selectedActivity) {
        // ...populate the form with its data
        this.interventionForm.patchValue({
          id: selectedActivity.ac_id,
          description: selectedActivity.ac_desc,
          value: selectedActivity.ac_amt,
          hide: selectedActivity.pi_hide,
        });
      }
    });
    this.subscriptions.add(sub as Subscription);
  }

  // --- Button Click Handlers ---

  onNew(): void {
    this.isNewMode.set(true);
    this.interventionForm.reset({
      table_type: this.interventionForm.get('table_type')?.value, // Keep the first dropdown value
      hide: false,
    });
    this.interventionForm.get('id')?.enable(); // Enable ID field for new entry
    this.interventionForm.get('id')?.setValidators(Validators.required);
    this.interventionForm.get('id')?.updateValueAndValidity();
    this.interventionForm.get('item_type')?.disable(); // Disable activity dropdown
    this.interventionForm.get('table_type')?.disable(); // Disable activity dropdown
  }

  onCancel(): void {
    this.isNewMode.set(false);
    this.interventionForm.reset();
    this.interventionForm.get('id')?.disable(); // Re-disable ID field
    this.interventionForm.get('id')?.clearValidators();
    this.interventionForm.get('id')?.updateValueAndValidity();
    this.interventionForm.get('item_type')?.enable(); // Re-enable activity dropdown
    this.interventionForm.get('table_type')?.enable(); // Re-enable activity dropdown
  }

  onSave(): void {
    if (this.interventionForm.invalid) {
      // You can add user feedback here, e.g., a toast message
      console.error('Form is invalid.');
      return;
    }

    const formValue = this.interventionForm.getRawValue();
    const payload: InterventionDataClasses = this.mapFormToModel(formValue);

    this.store.addNewInterventionDataClasses(payload);
    this.onCancel(); // Reset UI after saving
  }

  onUpdate(): void {
    if (this.interventionForm.invalid) {
      console.error('Form is invalid.');
      return;
    }
    const formValue = this.interventionForm.getRawValue();
    const payload: InterventionDataClasses = this.mapFormToModel(formValue);
    this.store.updateInterventionDataClasses(payload);
  }

  onDelete(): void {
    const idToDelete = this.interventionForm.get('id')?.value;
    if (!idToDelete) {
      console.error('No ID to delete.');
      return;
    }
    // You might want to add a confirmation dialog here
    this.store.deleteInterventionDataClasses(idToDelete);
    this.interventionForm.reset();
  }

  /**
   * Maps the form's value to the API's data model interface.
   */
  private mapFormToModel(formValue: any): InterventionDataClasses {
    return {
      ac_id: formValue.id,
      ac_desc: formValue.description,
      ac_amt: parseFloat(formValue.value) || 0, // Ensure value is a number
      pi_hide: formValue.hide,
    };
  }
}
