import { Component, OnInit } from '@angular/core';
import { ColumnDef, SharedDataTableComponent, SharedPanelContainerComponent } from 'shared-ui';
import {
  AlertClassesInterface,
  AlertFileMaintenanceService,
  AlertMatrixInterface,
} from './services/alert-file-maintenance.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select } from 'primeng/select';

interface AlertClasses {}

@Component({
  selector: 'tenant-alert-file-maintenance',
  imports: [
    SharedDataTableComponent,
    SharedPanelContainerComponent,
    Button,
    TableModule,
    InputTextModule,
    ReactiveFormsModule,
    Select,
  ],
  templateUrl: './alert-file-maintenance.component.html',
  styleUrl: './alert-file-maintenance.component.css',
})
export class AlertFileMaintenanceComponent implements OnInit {
  alertClasses: AlertClassesInterface[] = [];
  alertClassesLoading = false;
  alertClassesTotalRecords = 0;

  alertMatrix: AlertMatrixInterface[] = [];
  alertMatrixLoading = false;
  alertMatrixTotalRecords = 0;

  alertClassesForm: FormGroup;
  selectedClass: FormGroup | null = null;

  readonly alertClassesColumns: ColumnDef<AlertClasses>[] = [
    {
      field: 'class_name',
      header: 'Class Name',
      filter: { type: 'text', placeholder: 'Search by Class Name' },
    },
    {
      field: 'msg_name',
      header: 'Msg Name',
      filter: { type: 'text', placeholder: 'Search by Msg Name' },
    },
    {
      field: 'message',
      header: 'Message',
      filter: { type: 'text', placeholder: 'Search by Message' },
    },
    {
      field: 'check_type',
      header: 'Check Type',
      filter: { type: 'text', placeholder: 'Search by Check Type' },
    },
    {
      field: 'check_field',
      header: 'Check Field',
      filter: { type: 'text', placeholder: 'Search by Check Field' },
    },
    {
      field: 'criteria',
      header: 'Criteria',
      filter: { type: 'text', placeholder: 'Search by Criteria' },
    },
    {
      field: 'value_1',
      header: 'Value 1',
      filter: { type: 'text', placeholder: 'Search by Value 1' },
    },
    {
      field: 'value_2',
      header: 'Value 2',
      filter: { type: 'text', placeholder: 'Search by Value 2' },
    },
  ];
  readonly alertMatrixColumns: ColumnDef<AlertClasses>[] = [
    {
      field: 'id_drug',
      header: 'Id Drug',
      filter: { type: 'text', placeholder: 'Search by Id Drug' },
    },
    { field: 'name', header: 'Name', filter: { type: 'text', placeholder: 'Search by Name' } },
    { field: 'class', header: 'Class', filter: { type: 'text', placeholder: 'Search by Class' } },
    {
      field: 'msg_name',
      header: 'MsgName',
      filter: { type: 'text', placeholder: 'Search by Msg Name' },
    },
    {
      field: 'message',
      header: 'Message',
      filter: { type: 'text', placeholder: 'Search by Message' },
    },
    {
      field: 'alt_chk_type',
      header: 'AltChkType',
      filter: { type: 'text', placeholder: 'Search by AltChkType' },
    },
    {
      field: 'alt_chk_field',
      header: 'AltChkField',
      filter: { type: 'text', placeholder: 'Search by AltChkField' },
    },
    {
      field: 'alt_operator',
      header: 'AltOperator',
      filter: { type: 'text', placeholder: 'Search by AltOperator' },
    },
    {
      field: 'alt_chk_val1',
      header: 'AltChkVal1',
      filter: { type: 'text', placeholder: 'Search by AltChkVal1' },
    },
    {
      field: 'alt_chk_val2',
      header: 'AltChkVal2',
      filter: { type: 'text', placeholder: 'Search by AltChkVal2' },
    },
  ];

  ahfsClassOptions = [
    { label: 'Adamantanes', value: 'Adamantanes' },
    { label: 'Acidifying Agents', value: 'Acidifying Agents' },
    { label: 'Adrenals', value: 'Adrenals' },
    { label: 'Amebicides', value: 'Amebicides' },
  ];

  constructor(
    private alertFileMaintenanceservice: AlertFileMaintenanceService,
    private fb: FormBuilder, // Inject FormBuilder
  ) {
    // Initialize the form structure
    this.alertClassesForm = this.fb.group({
      classes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadAlertClasses();
    this.loadAlertMatrix();
  }

  // --- Getter for easy access to the FormArray in the template ---
  get classes(): FormArray {
    return this.alertClassesForm.get('classes') as FormArray;
  }

  loadAlertClasses(): void {
    this.alertClassesLoading = true;
    const data = this.alertFileMaintenanceservice.getAlertClasses();

    // Create a form group for each class and push it to the form array
    data.forEach((alertClass) => {
      this.classes.push(this.createClassRow(alertClass));
    });

    this.alertClassesLoading = false;
  }

  loadAlertMatrix(): void {
    this.alertMatrixLoading = true;
    this.alertMatrix = this.alertFileMaintenanceservice.getAlertMatrix();
    this.alertMatrixTotalRecords = this.alertMatrix.length;
    this.alertMatrixLoading = false;
  }

  // --- Helper to create a new FormGroup for a row ---
  createClassRow(alertClass: AlertClassesInterface): FormGroup {
    return this.fb.group({
      id: [alertClass.id],
      class_name: [alertClass.class_name],
      msg_name: [alertClass.msg_name],
      message: [alertClass.message],
      check_type: [alertClass.check_type],
      check_field: [alertClass.check_field],
      criteria: [alertClass.criteria],
      value_1: [alertClass.value_1],
      value_2: [alertClass.value_2],
    });
  }

  // --- Add a new, empty row to the table ---
  addNewClass(): void {
    const newClass: AlertClassesInterface = {
      id: `new-${Date.now()}`, // Temporary ID
      class_name: '',
      msg_name: '',
      message: '',
      check_type: 0,
      check_field: '',
      criteria: '',
      value_1: 0,
      value_2: 0,
    };
    this.classes.push(this.createClassRow(newClass));
  }

  // --- Delete a row from the table ---
  deleteSelectedClass(): void {
    if (!this.selectedClass) {
      return; // Exit if no row is selected
    }
    // Find the index of the selected FormGroup in the FormArray
    const index = this.classes.controls.indexOf(this.selectedClass);
    if (index > -1) {
      this.classes.removeAt(index);
    }
    this.selectedClass = null; // Clear the selection after deletion
  }

  onCellEditComplete(event: any) {
    // The data is already updated in the form model.
    // 'event.index' is the row index in the FormArray.
    const updatedRowGroup = this.classes.at(event.index);
    console.log('Cell edit complete. Updated row value in form:', updatedRowGroup.value);
    // You can now save this updatedRowGroup.value to your backend.
  }
}
