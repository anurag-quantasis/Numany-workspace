import { Component, computed, inject, input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { Divider } from 'primeng/divider';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { UiDialogService } from 'projects/tenant-numany/src/app/core/services/ui-dialog.service';
import { ListAlertComponent } from '../item-maintenance-dialogs/list-alert/list-alert.component';
import { RemoteLocationComponent } from '../item-maintenance-dialogs/remote-locations/remote-locations.component';
import { OrderHistoryComponent } from '../item-maintenance-dialogs/order-history/order-history.component';

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
    SharedPanelContainerComponent,
    InputTextModule,
  ],
  providers: [MessageService],
  templateUrl: './item-maintenance-form.component.html',
})
export class ItemMaintenanceFormComponent {
  id = input.required<string>();
  isEditMode = computed(() => this.id() !== 'new');
  isNew = computed(() => this.id() === 'new');
  form: FormGroup;

  ref: DynamicDialogRef | undefined;
  private uiDialogService = inject(UiDialogService);

  // --- Options for Dropdowns and Radios ---
  routesOptions = [
    { label: 'bucl', value: 'bucl' },
    { label: 'dent', value: 'dent' },
    { label: 'epid', value: 'epid' },
    { label: 'iatc', value: 'iatc' },
    { label: 'idrm', value: 'idrm' },
    { label: 'im', value: 'im' },
  ];

  chargeClassOptions = [
    { label: 'ORALS SOLIDS', value: 'ORALS SOLIDS' },
    { label: 'PB IV SOLNS', value: 'PB IV SOLNS' },
    { label: `OTC'S/ TOPICALS/ ETC`, value: `OTC'S/ TOPICALS/ ETC` },
    { label: 'SUPPOSITORIES', value: 'SUPPOSITORIES' },
  ];

  altChargeClassOptions = [
    { label: 'ABC Class', value: 'ABC Class' },
    { label: 'CMK 100% + 2.50 fee', value: 'CMK 100% + 2.50 fee' },
    { label: 'Equipement Rental', value: 'Equipement Rental' },
  ];

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
      txtIddrug: ['', [Validators.required, Validators.pattern(/^[^\s].*/)]],
      txtNamdrg: ['', [Validators.required, Validators.pattern(/^[^\s].*/)]],
      txtNamdr2: [''],
      txtIsize: [''],
      txtDoseCheck: ['', Validators.pattern(/^\d+$/)],
      tdbcRt: [''],
      txtIflry: [''],
      txtNdc: [''],
      metric: [''],
      txtIchcod: [''],
      tdbcListColor: [''],
      optForm: ['Yes', Validators.required],
      optCLNK_Chk: ['On', Validators.required],
      txtGenName: [''],
      txtStrength: ['', Validators.pattern(/^\d+$/)],
      txtStrengthUnit: [''],
      txtDoseForm: [''],
      txtVolume: ['', Validators.pattern(/^\d+$/)],
      txtGPI: [''],
      txtVerb: [''],
      txtExt_GenCode: [''],
      txtBC_ScanID: [''],
      txtDDID: [''],
      txtAvcost: ['', Validators.pattern(/^\d+$/)],
      txtAwpr: ['', Validators.pattern(/^\d+$/)],
      txtCcost: ['', Validators.pattern(/^\d+$/)],
      txtPcost: ['', Validators.pattern(/^\d+$/)],
      txtPCOSNH: ['', Validators.pattern(/^\d+$/)],
      txtPCOSTP: ['', Validators.pattern(/^\d+$/)],
      txtOPCostBasis: [''],
      txtItemStatus: [''],
      scanTest: ['', Validators.required],
      txtSUPPNAME: [''],
      tdbDrgTyp: [''],
      tdbChapar: ['', Validators.required],
      tdbChapar_Alt: [''],
      autoStopDays: [5, Validators.required],
      tdbTax: [''],
      cbNoEMarChg: [false],
      cbSecVal: [false],
      cbVS: this.fb.array([false, false, false, false, false]),
      txtInvadd: this.fb.array(
        Array(12)
          .fill(null)
          .map(() => this.fb.control('', Validators.pattern(/^\d+$/))),
      ),
      currentUsage: this.fb.group({
        ytdUsage: [''],
        mtdDispensed: [''],
        mtdOrders: [''],
        txtNstock: ['', Validators.pattern(/^\d+$/)],
        txtLow: ['', Validators.pattern(/^\d+$/)],
        txtEmerROL: ['', Validators.pattern(/^\d+$/)],
        txtROQty: ['', Validators.required],
        txtIdvucv: [''],
        txtIdvid: [''],
        txtIchcod: [''],
        txtJCODE: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        txtManuf: [''],
        txtLocn: [''],
      }),
      orderHistory: [''],
      supplier: [''],
      txtIdrcc: [''],
      txtKxdate: [''],
      adminNote: [''],
      miscNote: [''],
      noteForOrderEntry: [''],
    });
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.form.controls;
  }

  // Getter for easy access to the nested form group
  get currentUsageControls() {
    return (this.form.get('currentUsage') as FormGroup).controls;
  }

  get txtInvadd() {
    return this.form.get('txtInvadd') as FormArray;
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

  openListAlert() {
    this.uiDialogService.open(ListAlertComponent, '');
  }
  openRemoteLocations() {
    this.uiDialogService.open(RemoteLocationComponent, '');
  }
  openOrderHistory() {
    this.uiDialogService.open(OrderHistoryComponent, 'Order History');
  }
}
