// .../expired-med-report/expired-med-report.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; // <-- Import inject, OnInit
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule as CalendarModule } from 'primeng/datepicker'; // Renaming for clarity
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'; // <-- Import Config too

@Component({
  selector: 'tenant-expired-med-report',
  standalone: true, // Make sure this is standalone
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, CheckboxModule, ButtonModule],
  templateUrl: './expired-med-report.component.html',
  styleUrl: './expired-med-report.component.css',
})
export class ExpiredMedReportComponent implements OnInit {
  // <-- Implement OnInit
  // Use inject() for cleaner DI. It's the modern standard.
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  // Initialize the form group directly
  reportDateGroup = new FormGroup({
    reportDate: new FormControl<Date | null>(new Date()), // Default to today
    ischecked: new FormControl<boolean>(false),
  });

  // No need for this here if this component is only for the report
  // modifyDateGroup: FormGroup | undefined;

  // The constructor can now be empty or removed if not needed
  constructor() {
    // You can access passed-in data here
    console.log('Data received in dialog:', this.config.data);
  }

  // ngOnInit is no longer needed for form initialization
  ngOnInit(): void {}

  startReport() {
    if (this.reportDateGroup.valid) {
      console.log('Generating report with values:', this.reportDateGroup.value);
      // Pass the form data back when closing
      this.ref.close(this.reportDateGroup.value);
    }
  }

  cancel() {
    this.ref.close(); // Just close without sending data
  }
}
