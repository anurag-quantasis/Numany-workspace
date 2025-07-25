import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SharedPanelContainerComponent } from 'shared-ui';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { UiDialogService } from '../../../core/services/ui-dialog.service';
import { AdmitComponent } from './admit/admit.component';
import { TransferComponent } from './transfer/transfer.component';

@Component({
  selector: 'tenant-patients',
  standalone: true,
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    ReactiveFormsModule,
    SharedPanelContainerComponent,
    FormsModule,
    TableModule,
    PaginatorModule,
    MenuModule,
    RouterModule,
  ]
})
export class PatientsComponent implements OnInit {
onMenuButtonClick($event: MouseEvent,_t77: Menu) {
throw new Error('Method not implemented.');
}
  patientForm!: FormGroup;
  
  private uiDialogService = inject(UiDialogService);

  adtFunctions = [
    'OP Ctrl+O',
    'Admit Ctrl+A',
    'Transfer Ctrl+T',
    'Discharge Ctrl+D',
    'Print ADT Label Ctrl+L'
  ];
  selectedAdtFunction: string | null = null;

  patients = [
    {
      bedId: 'CMK01',
      name: 'PATIENT, TEST A',
      patientId: '1000000',
      medRec: '20000',
      dob: '1990-01-01',
      ssn: '123-45-6789',
      admitted: '2025-07-20',
      discharged: ''
    },
    {
      bedId: 'CMK02',
      name: 'Jane Smith',
      patientId: 'P124',
      medRec: 'MR457',
      dob: '1985-04-15',
      ssn: '987-65-4321',
      admitted: '2025-07-21',
      discharged: '8/18/2025 18:00'
    },
    {
      bedId: 'CMK03',
      name: 'Sam Smith',
      patientId: 'P324',
      medRec: 'MR457',
      dob: '1985-04-15',
      ssn: '987-65-4321',
      admitted: '2025-07-21',
      discharged: '24/1/2023 13:00'
    },
    {
      bedId: '100-A',
      name: 'TEST ALERT',
      patientId: '1308066',
      medRec: 'MR457',
      dob: '1985-04-15',
      ssn: '987-65-4321',
      admitted: '2025-07-21',
      discharged: ''
    },
    {
      bedId: '100-B',
      name: 'TEST ALERT',
      patientId: '1308033',
      medRec: 'MR457',
      dob: '1985-04-15',
      ssn: '987-65-4321',
      admitted: '2025-07-21',
      discharged: '31/8/2024 12:00'
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      discharged: [false],
      patientsArchived: [false]
    });
  }

  getActions(patient: any): MenuItem[] {
    return [
      {
        label: 'OP Admit',
        command: () => console.log('OP Admit clicked for', patient)
      },
      {
        label: 'Admit',
        command: () => {
          this.uiDialogService.open(
            AdmitComponent,
            'Admit to Bed',
          )
        }
      },
      {
        label: 'Transfer',
          command: () => {
          this.uiDialogService.open(
            TransferComponent,
            'Transfer To Bed',
          );
        }
      },
      {
        label: 'Discharge',
        command: () => console.log('Discharge clicked for', patient)
      },
      {
        label: 'Print ADT Labelx  ',
        command: () => console.log('Print ADT Label clicked for', patient)
      }
    ];
  }

  onAdtFunctionChange(value: string) {
    console.log('Selected ADT Function:', value);
  }
}
