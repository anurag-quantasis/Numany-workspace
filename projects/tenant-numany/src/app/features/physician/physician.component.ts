import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { PhysicianStore } from './physician-store/physician.store';
import { Physician } from './physician-store/physician.model';

@Component({
  selector: 'main-physician',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    SharedPanelContainerComponent,
    CustomInputComponent,
  ],
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css'],
  providers: [PhysicianStore],
})
export class PhysicianComponent implements OnInit {
  readonly store = inject(PhysicianStore);
  private fb = inject(FormBuilder);
  physician!: FormGroup;
  // Store doctors locally
  doctors: Physician[] = [];
  isAddMode = signal(false);

  constructor() {
    effect(() => {
      const selectedId = this.physician?.get('selectedName')?.value;
      if (selectedId && !this.isAddMode()) {
        this.isAddMode.set(false); // A selection was made, so we are not in "Add" mode
        const physicianData = this.store.physician().find((p) => p.id_doc === selectedId);
        if (physicianData) {
          this.physician.patchValue(physicianData);
        }
      }
    });
    effect(() => {
      const physicians = this.store.physician();
      const selectedId = this.physician?.get('selectedName')?.value;
      if (selectedId && !physicians.some((p) => p.id_doc === selectedId)) {
        this.resetForm(false); // Reset without entering add mode
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.store.loadPhysician(); // Load the initial list of physicians

    // Listen to changes in the dropdown selection
    this.physician.get('selectedName')?.valueChanges.subscribe((id) => {
      if (!id) {
        this.resetForm(false);
      }
    });
  }

  private initializeForm(): void {
    this.physician = this.fb.group({
      selectedName: [null], // This control drives the selection
      id_doc: [{ value: '', disabled: true }], // ID should often be non-editable
      hide_dr: [false],
      e_rx_yn: [false],
      nam_doc: [''],
      adr_doc: [''],
      cty_doc: [''],
      st_doc: [''],
      zip_doc: [''],
      dea_no: [''],
      phone: [''],
      st_lic: [''],
      up_in: [''],
      npi: [''],
      m_care_dr: [''],
      m_caid_dr: [''],
      local_id: [''],
    });
  }

  private resetForm(enterAddMode: boolean): void {
    this.physician.reset({
      id_doc: '',
      hide_dr: false,
      e_rx_yn: false,
    });
    // This part is crucial for setting the mode
    this.isAddMode.set(enterAddMode);

    if (enterAddMode) {
      this.physician.get('id_doc')?.enable();
    } else {
      this.physician.get('id_doc')?.disable();
    }
  }
  // --- Event Handlers ---

  enterAddMode(): void {
    this.resetForm(true);
  }

  cancelAddMode(): void {
    this.resetForm(false);
  }

  onUpdate(): void {
    // MODIFIED: Destructure the raw value to separate the UI-only control from the data payload
    const { selectedName, ...physicianPayload } = this.physician.getRawValue();

    if (!physicianPayload.id_doc) {
      alert('Please select a physician to update.');
      return;
    }
    // The store receives a clean object without the 'selectedName' property
    this.store.updatePhysician(physicianPayload as Physician);
  }

  onDelete(): void {
    const physicianId = this.physician.get('id_doc')?.value;
    if (!physicianId) {
      alert('Please select a physician to delete.');
      return;
    }
    if (confirm('Are you sure you want to delete this physician?')) {
      this.store.deletePhysician(physicianId);
    }
  }

  onSave(): void {
    if (this.physician.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    // MODIFIED: Use the same destructuring technique to create a clean payload
    const { selectedName, ...physicianPayload } = this.physician.getRawValue();

    // Call the store method with the clean payload
    this.store.addNewPhysician(physicianPayload as Physician);

    // After successfully initiating the save, exit add mode
    this.cancelAddMode();
  }
}
