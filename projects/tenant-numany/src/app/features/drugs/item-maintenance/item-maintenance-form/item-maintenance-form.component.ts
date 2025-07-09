import { Component, computed, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Angular & Custom Component Imports ---
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --- PrimeNG Module Imports ---
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from 'shared-ui';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-item-maintenance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    FieldsetModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    CustomInputComponent,
    TextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './item-maintenance-form.component.html',
})
export class ItemMaintenanceFormComponent {
  id = input.required<string>();
  isEditMode = computed(() => this.id() !== 'new');

  // 2. 'isNew' is now a computed signal derived from the 'id' input.
  // It will automatically update if the 'id' signal ever changes.
  isNew = computed(() => this.id() === 'new');
  form: FormGroup;

  // --- Options for Dropdowns and Radios ---
  listColorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'None', value: null },
  ];

  medicationTypeOptions = [
    { label: 'Unit-dose Med', value: 'Unit-dose Med' },
    { label: 'IV', value: 'IV' },
    { label: 'Bulk', value: 'Bulk' },
  ];

  taxApplicabilityOptions = [
    { label: 'Primary Tax', value: 'Primary Tax' },
    { label: 'Secondary Tax', value: 'Secondary Tax' },
    { label: 'Not Applicable', value: 'N/A' },
  ];

  drugControlClassOptions = [
    { label: 'Schedule I', value: 'C1' },
    { label: 'Schedule II', value: 'C2' },
    { label: 'Schedule III', value: 'C3' },
    { label: 'Legend Drug', value: 'Legend' },
    { label: 'Non-controlled', value: 'None' },
  ];

  formularyStatusOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  clinicalChecksOptions = [
    { label: 'On', value: 'On' },
    { label: 'Off', value: 'Off' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // The FormGroup remains exactly as you provided it.
      drugId: ['', Validators.required],
      primaryName: ['', Validators.required],
      secondaryName: ['', Validators.required],
      unitOfUse: ['', Validators.required],
      doseCheckUnits: ['', Validators.required],
      poRoute: ['PO', Validators.required],
      ahesClass: ['', Validators.required],
      ndcNumber: ['', Validators.required],
      metric: ['', Validators.required],
      billing: ['', Validators.required],
      listColor: ['', Validators.required],
      formularyStatus: ['Yes', Validators.required],
      clinicalChecks: ['On', Validators.required],
      genericName: ['', Validators.required],
      strength: ['', Validators.required],
      unit: ['', Validators.required],
      doseForm: ['', Validators.required],
      volume: ['', Validators.required],
      gpi: ['', Validators.required],
      hostGenericCode: ['', Validators.required],
      alternateBarcodeScan: ['', Validators.required],
      suppNameDrugId: ['', Validators.required],
      scanTest: ['', Validators.required],
      supplementalName: ['', Validators.required],
      medicationType: ['Unit-dose Med', Validators.required],
      chargeClass: ['', Validators.required],
      autoStopDays: [5, Validators.required],
      taxApplicability: ['Primary Tax', Validators.required],
      chargeUnit: [10, Validators.required],
      displayClinicalInfo: [false, Validators.required],
      reCalculateCharge: [false, Validators.required],
      skipEmar: [false, Validators.required],
      requireSecondValidation: [false, Validators.required],
      vitalSigns: this.fb.group({
        pulse: [false],
        temp: [false],
        bp: [false],
        resp: [false],
        misc: [false],
      }),
      usageLast12Months: this.fb.group({
        jan: [''],
        feb: [''],
        mar: [''],
        apr: [''],
        may: [''],
        jun: [''],
        jul: [''],
        aug: [''],
        sep: [''],
        oct: [''],
        nov: [''],
        dec: [''],
      }),
      currentUsage: this.fb.group({
        ytdUsage: [''],
        mtdDispensed: [''],
        mtdOrders: [''],
        stockLevel: [''],
        reorderLevel: [''],
        emergencyReorder: [''],
        reorderQty: [''],
        vendorUnits: [''],
      }),
      orderHistory: [''],
      billingCode: [''],
      jcodeUnits: [''],
      vendorDrugId: [''],
      supplier: [''],
      manufacturer: [''],
      locator: [''],
      drugControlClass: [''],
      expirationDate: [''],
      adminNote: [''],
      miscNote: [''],
      noteForOrderEntry: [''],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      alert('Form Submitted! Check console for data.');
    } else {
      console.error('Form is invalid.');
      this.form.markAllAsTouched();
    }
  }

  get currentDrugId(): string {
    return this.form.get('drugId')?.value ?? '';
  }
}
