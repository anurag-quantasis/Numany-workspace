import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SharedPanelContainerComponent } from 'shared-ui';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-ward-bed',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    SharedPanelContainerComponent,
    InputTextModule
  ],
  templateUrl: './ward-bed-area-maintenance.component.html'
})
export class WardBedAreaMaintenanceComponent implements OnInit {
  wardBedForm!: FormGroup;

  options = [
    { name: 'Option 1' },
    { name: 'Option 2' },
    { name: 'Option 3' },
    { name: 'Option 4' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.wardBedForm = this.fb.group({
      selectedOption: [null],
      wardArea: [''] 
    });
  }
}
