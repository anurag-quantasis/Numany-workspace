import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { Button } from 'primeng/button';

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
    Button,
  ],
  templateUrl: './site-parameters.component.html',
  styleUrl: './site-parameters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteParametersComponent implements OnInit {
  siteParametersForm!: FormGroup;
  private fb = inject(FormBuilder);

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
        0,
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
        0,
        [
          Validators.pattern(/^[0-9]+$/),
          // Primary Tax %: numeric, integer only
        ],
      ],
      secondaryTax: [
        0,
        [
          Validators.pattern(/^[0-9]+$/),
          // Secondary Tax %: numeric, integer only
        ],
      ],
      primaryTaxdiscounted: [
        0,
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
      dischargeDays: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      ucoInterval: [
        0,
        [Validators.required, Validators.maxLength(2), Validators.pattern(/^[0-9]*$/)],
      ],
      passwordExpirationDays: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      isDebugMode: [false],
      defaultToDoseStrength: [false],
      confirmValidation: [false],
      isRxOpEnabled: [{ value: false }],
      emarEnabled: [{ value: false, disabled: true }],
      nextRxNumber: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      hideSupplierName: [false],
      hideDcOrdersDays: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      updateInventoryOnAdmin: [{ value: false, disabled: true }],
      language: ['1', Validators.required],

      // Daily Charge Defaults
      isJCodeUnitCharge: [false],
      marDays: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      allowDailyChargeByDateRange: [false],
      includeAllTransactions: [false],
      bedProcessing: ['O', Validators.required],
      transactionProcessing: ['O', Validators.required],
      postDateProcessing: ['O', Validators.required],
    });
  }

  //   ngOnInit(): void {
  //     // ...existing code...
  // this.siteParametersForm = this.fb.group({
  //   // Facility Information
  //   hospitalName: ['', [
  //     Validators.required,
  //     Validators.maxLength(50)
  //     // Hospital Name: Required, max 50 chars
  //   ]],
  //   addressLine1: ['', [
  //     Validators.maxLength(30)
  //     // Address: max 30 chars
  //   ]],
  //   addressLine2: ['', [
  //     Validators.maxLength(30)
  //     // Address Line 2: max 30 chars
  //   ]],
  //   city: ['', [
  //     Validators.maxLength(20)
  //     // City: max 20 chars
  //   ]],
  //   state: ['', [
  //     Validators.maxLength(2)
  //     // State: max 2 chars
  //   ]],
  //   zipCode: ['', [
  //     Validators.maxLength(20)
  //     // Zip/Postal Code: max 20 chars
  //   ]],
  //   phoneNumber: ['', [
  //     Validators.maxLength(20)
  //     // Phone Number: max 20 chars
  //   ]],

  //   // Patient ID Field Labels
  //   altIdDesc: ['', [
  //     Validators.maxLength(30)
  //     // Alternate External ID: max 30 chars
  //   ]],
  //   ssNumDesc: ['', [
  //     Validators.maxLength(30)
  //     // Additional External ID: max 30 chars
  //   ]],
  //   mrnDesc: ['', [
  //     Validators.maxLength(30)
  //     // Alternate Internal ID: max 30 chars
  //   ]],
  //   ihosnDesc: ['', [
  //     Validators.maxLength(30)
  //     // Unique ID: max 30 chars
  //   ]],
  //   drLocalIdLabel: ['', [
  //     Validators.maxLength(30)
  //     // Physician Local ID Label: max 30 chars
  //   ]],

  //   // System Settings
  //   systemType: ['USA', [
  //     Validators.maxLength(3),
  //     Validators.pattern(/^(USA|CAN)$/)
  //     // System type: "USA" or "CAN"
  //   ]],
  //   isMetric: [false
  //     // METRIC: boolean
  //   ],
  //   fiscalYearStart: [1, [
  //     Validators.required,
  //     Validators.min(1),
  //     Validators.max(12)
  //     // Begin_Fiscal_Year: Required, 1-12
  //   ]],
  //   timeDateFormat: ['', [
  //     Validators.maxLength(50)
  //     // Time_Date_Format: max 50 chars, must match Windows settings
  //   ]],
  //   dischargeDays: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Number of days after Discharge before archiving patient: Required, numeric
  //   ]],
  //   hideDcOrdersDays: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Number of days after DC to hide Orders on profile: Required, numeric
  //   ]],
  //   ucoInterval: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/),
  //     Validators.max(60)
  //     // UCO Status Interval: Required, numeric, max 60
  //   ]],
  //   passwordExpirationDays: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Pwd Expiration: Required, numeric, only for SA/DBO, hidden if TrustedConnection
  //   ]],
  //   nextRxNumber: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Next Rx #: Required, numeric
  //   ]],
  //   autoStopTime: ['', [
  //     Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  //     // Auto Stop Time: "HH:MM" format, hours 00-23, minutes 00-59
  //   ]],
  //   language: ['1', [
  //     Validators.required
  //     // User Interface Language: "1"=English, "2"=Spanish
  //   ]],
  //   isDebugMode: [false
  //     // Debug/Trace Mode: boolean
  //   ],
  //   defaultToDoseStrength: [false
  //     // OE Start in Dose Strength: boolean
  //   ],
  //   confirmValidation: [false
  //     // Confirm Validation(RPh): boolean
  //   ],
  //   hideSupplierName: [false
  //     // Hide Supp Name from Drug Look-up: boolean
  //   ],
  //   updateInventoryOnAdmin: [{ value: false, disabled: true }
  //     // Update Inventory on EMAR Administration: boolean, enabled only if EMAR enabled
  //   ],
  //   isRxOpEnabled: [{ value: false, disabled: true }
  //     // Rx OP Options Enabled: boolean, enabled only if RxOP enabled
  //   ],
  //   emarEnabled: [{ value: false, disabled: true }
  //     // EMAR Enabled: boolean, enabled only if EMAR license present
  //   ],

  //   // Medication Batch Fill Parameters
  //   fillDays: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Number of days to Default Fill Thru: Required, numeric
  //   ]],
  //   fillEndTime: ['', [
  //     Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  //     // Default Fill End Time: "HH:MM" format
  //   ]],
  //   medFillReport: ['', [
  //     Validators.maxLength(100)
  //     // Report Format File: max 100 chars
  //   ]],
  //   allowOneTxnPerDose: [false
  //     // Allow OneTxn/Dose: boolean
  //   ],
  //   fillCharging: [false
  //     // Automatic Charging: boolean
  //   ],
  //   allowFillRange: [false
  //     // Allow Med & IV Fill by Range: boolean
  //   ],

  //   // IV Labels & IV Fill Parameters
  //   ivLabelFormat: ['', [
  //     Validators.maxLength(100)
  //     // IV Label format file name: max 100 chars
  //   ]],
  //   oeIvLabels: [false
  //     // Print labels at Order Entry: boolean
  //   ],
  //   ivFillCharging: [false
  //     // Charge in IV Fill: boolean
  //   ],
  //   ivoeCharging: [false
  //     // Charge at Order Entry: boolean
  //   ],

  //   // Medication Label Parameters
  //   medPrinter: ['', [
  //     Validators.maxLength(100)
  //     // Med & PassMed Label printer name: max 100 chars
  //   ]],
  //   medLabelFormat: ['', [
  //     Validators.maxLength(100)
  //     // Med Label format file name: max 100 chars
  //   ]],
  //   oeMedLabels: [false
  //     // Print Labels at Order Entry: boolean
  //   ],
  //   medOeCharging: [false
  //     // Charge at Order Entry: boolean
  //   ],
  //   chgBulk: [false
  //     // Charge "BULK" orders at Order Entry: boolean
  //   ],
  //   rxOpPtEdFormat: ['0'
  //     // RxOP Pt Ed Format: "0"=Standard, "1"=Short, "2"=Long; only visible if g_bOPOnly
  //   ],

  //   // Drug Usage & Cost Parameters
  //   averInvCost: [false
  //     // Update Average Unit Cost to last rec'd unit cost when posting invoices: boolean
  //   ],
  //   incYtdIdpt: [false
  //     // Include Interdepartmental use in YTD drug usage: boolean
  //   ],
  //   incMtdIdpt: [false
  //     // Include Interdepartmental use in MTD drug usage: boolean
  //   ],
  //   ptax: [0, [
  //     Validators.pattern(/^[0-9]+$/)
  //     // Primary Tax %: numeric
  //   ]],
  //   stax: [0, [
  //     Validators.pattern(/^[0-9]+$/)
  //     // Secondary Tax %: numeric
  //   ]],
  //   ptaxd: [0, [
  //     Validators.pattern(/^[0-9]+$/)
  //     // Primary Tax % (Discounted): numeric
  //   ]],

  //   // Daily Charge Defaults
  //   isJCodeUnitCharge: [false
  //     // Patient Unit Charge is JCODE Unit Charge: boolean
  //   ],
  //   marDays: [0, [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]+$/)
  //     // Patient Charge Rounding Factor: Required, numeric
  //   ]],
  //   allowDailyChargeByDateRange: [false
  //     // Allow Daily Charge by Transaction Activity: boolean
  //   ],
  //   includeAllTransactions: [false
  //     // Include ALL Tx for each patient: boolean, enabled only if allowDailyChargeByDateRange is true
  //   ],
  //   bedProcessing: ['W', [
  //     Validators.required
  //     // Bed Processing: "W", "D", "B", "P", "O"
  //   ]],
  //   transactionProcessing: ['O', [
  //     Validators.required
  //     // Tx or Order Processing: "O", "C", "T", "E" (E only if EMAR enabled)
  //   ]],
  //   postDateProcessing: ['M', [
  //     Validators.required
  //     // Use Posting Date: "M", "C"
  //   ]],

  //   // Clinical Settings
  //   clinicalSystemType: ['0', [
  //     Validators.required
  //     // ClinicalSysType: "0"=Medispan Solution, "1"=First DataBank, "2"=Medispan Clinical
  //   ]],
  //   primaryCodingSystem: ['1', [
  //     Validators.required
  //     // PrimaryCodingSystem: "1"=ICD9, "2"=ICD10
  //   ]],
  //   isClinicalCheckingOn: [false
  //     // Clinical Checking On: boolean
  //   ],
  //   isDoseCheckingOn: [false
  //     // Dose Checking On: boolean
  //   ],
  //   allowClinicalTechModify: [false
  //     // Allow All ClinicalTechs Modify/DC access: boolean
  //   ],
  //   allowClinicalTechUcoView: [false
  //     // Allow ClinicalTechs ViewOnly UCO List: boolean
  //   ],

  //   // Miscellaneous
  //   printDcLabel: [false
  //     // Print DC Label: boolean
  //   ]
  // });
  // // ...existing code...
  //   }
}
