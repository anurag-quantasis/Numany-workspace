import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedPanelContainerComponent, CustomInputComponent, SharedStateSelectorComponent } from 'shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'tenant-site-parameters',
  imports: [
    SharedPanelContainerComponent,
    CustomInputComponent,
    CommonModule,
    ReactiveFormsModule,
    FieldsetModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule,
    SharedStateSelectorComponent,
],
  templateUrl: './site-parameters.component.html',
  styleUrl: './site-parameters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteParametersComponent implements OnInit {
  siteParametersForm!: FormGroup;
  private fb = inject(FormBuilder);
  submitted = false;

  // Options for dropdowns
  processingOptions = [
    { label: 'By Qty Dispensed on Orders', value: 'O' },
    { label: 'By Charge Date', value: 'C' },
    { label: 'By Transaction Date', value: 'T' },
  ];

  // Options for dropdowns/radio groups
  bedProcessingOptions = [
    { label: 'By Qty Dispensed on Orders', value: 'O' },
    { label: 'By Ward/Bed', value: 'W' },
    { label: 'By Department', value: 'D' },
    { label: 'By Bed', value: 'B' },
    { label: 'By Patient', value: 'P' },
  ];

  transactionProcessingOptions = [
    { label: 'By Qty Dispensed on Orders', value: 'O' },
    { label: 'By Charge Date', value: 'C' },
    { label: 'By Transaction Date', value: 'T' },
    { label: 'By Entry Date', value: 'E' },
  ];

  postDateProcessingOptions = [
    { label: 'Manual', value: 'M' },
    { label: 'By Charge Date', value: 'C' },
  ];

  rxOpPtEdFormatOptions = [
    { label: 'Standard', value: '0' },
    { label: 'Short', value: '1' },
    { label: 'Long', value: '2' },
  ];

  ngOnInit(): void {
    this.siteParametersForm = this.fb.group({
      // Facility Information
      hospitalName: ['', [Validators.required, Validators.maxLength(50)]],
      addressLine1: ['', [Validators.maxLength(60)]],
      city: ['', [Validators.maxLength(20)]],
      state: ['', [Validators.maxLength(2)]],
      zipCode: ['', [Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9]+$/)]],

      // IV Labels & IV Fill Parameters
      ivLabelFormat: ['', [Validators.maxLength(100)]],
      oeIvLabels: [false],
      ivoeCharging: [false],
      ivFillCharging: [false],

      // Medication Label Parameters
      medPrinter: ['', [Validators.maxLength(100)]],
      medLabelFormat: ['', [Validators.maxLength(100)]],
      oeMedLabels: [false],
      medOeCharging: [false],
      chgBulk: [false],
      rxOpPtEdFormat: ['0'], // 0=Standard, 1=Short, 2=Long

      // Miscellenaous
      allowFillRange: [false],
      printDcLabel: [false],
      autoStopTime: [
        '',
        [
          // Must be in HH:MM 24-hour format, hours 00-23, minutes 00-59
          Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        ],
      ],

      // Medication Batch Fill Parameters
      fillDays: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          // Number of days to Default Fill Thru: Required, integer only
        ],
      ],
      fillEndTime: [
        '',
        [
          Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
          // Default Fill End Time: Optional, must be HH:MM 24-hour format
        ],
      ],
      medFillReport: [
        '',
        [
          Validators.maxLength(100),
          // Report Format File: Optional, string, max 100 chars
        ],
      ],
      allowOneTxnPerDose: [
        false,
        // Allow OneTxn/Dose: Boolean
      ],
      fillCharging: [
        false,
        // Automatic Charging: Boolean
      ],

      // Drug Usage & Cost Parameters
      averInvCost: [
        false,
        // Update Average Unit Cost to last rec'd unit cost when posting invoices: boolean
      ],
      incYtdIdpt: [
        false,
        // Include Interdepartmental use in YTD drug usage: boolean
      ],
      incMtdIdpt: [
        false,
        // Include Interdepartmental use in MTD drug usage: boolean
      ],
      primaryTax: [
        null,
        [
          Validators.pattern(/^[0-9]+$/),
          // Primary Tax %: numeric, integer only
        ],
      ],
      secondaryTax: [
        null,
        [
          Validators.pattern(/^[0-9]+$/),
          // Secondary Tax %: numeric, integer only
        ],
      ],
      primaryTaxdiscounted: [
        null,
        [
          Validators.pattern(/^[0-9]+$/),
          // Primary Tax % (Discounted): numeric, integer only
        ],
      ],

      // Clinical Settings
      clinicalSystemType: [
        '0',
        [
          Validators.required,
          // ClinicalSysType: "0"=Medispan Solution, "1"=First DataBank, "2"=Medispan Clinical
        ],
      ],
      primaryCodingSystem: [
        '1',
        [
          Validators.required,
          // PrimaryCodingSystem: "1"=ICD9, "2"=ICD10
        ],
      ],
      isClinicalCheckingOn: [
        false,
        // Clinical Checking On: Boolean, maps to MSFLAG
      ],
      isDoseCheckingOn: [
        false,
        // Dose Checking On: Boolean, maps to MSPDC logic
      ],
      allowClinicalTechModify: [
        false,
        // Allow All ClinicalTechs Modify/DC access: Boolean, encoded in "Med Printer" field (first char)
      ],
      allowClinicalTechUcoView: [
        false,
        // Allow ClinicalTechs ViewOnly UCO List: Boolean, encoded in "Med Printer" field (second char)
      ],

      // System Settings
      systemType: ['USA', [Validators.maxLength(3), Validators.pattern(/^(USA|CAN)$/)]],
      isMetric: [false],
      fiscalYearStart: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      timeDateFormat: ['', [Validators.maxLength(50)]],
      dischargeDays: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      ucoInterval: [
        null,
        [Validators.required, Validators.maxLength(2), Validators.pattern(/^[0-9]*$/)],
      ],
      passwordExpirationDays: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      isDebugMode: [false],
      defaultToDoseStrength: [false],
      confirmValidation: [false],
      isRxOpEnabled: [{ value: false }],
      emarEnabled: [{ value: false, disabled: true }],
      nextRxNumber: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      hideSupplierName: [false],
      hideDcOrdersDays: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      updateInventoryOnAdmin: [{ value: false, disabled: true }],
      language: ['1', Validators.required],

      // Daily Charge Defaults
      isJCodeUnitCharge: [false],
      marDays: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      allowDailyChargeByDateRange: [false],
      includeAllTransactions: [false],
      bedProcessing: ['O', Validators.required],
      transactionProcessing: ['O', Validators.required],
      postDateProcessing: ['O', Validators.required],
    });
  }

  myForm = this.fb.group({
    engineDesigner: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s.-]+$/)]], // Allow dots and hyphens
    
    // Use our new custom validators and a pattern for digits only
    hour: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/),]],
    
    minute: ['', [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
  });

   // Helper getters make the template cleaner
  get controls() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.siteParametersForm.invalid) {
      // Mark all fields as touched to show errors
      console.log('Form not', this.siteParametersForm.value);
      this.siteParametersForm.markAllAsTouched();
      return;
    }
    console.log('Form Submitted!', this.siteParametersForm.value);
  }
}
