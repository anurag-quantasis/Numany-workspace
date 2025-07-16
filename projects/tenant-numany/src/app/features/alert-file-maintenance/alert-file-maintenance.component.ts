import { Component, OnInit } from '@angular/core';
import { ColumnDef, SharedDataTableComponent, SharedPanelContainerComponent } from 'shared-ui';
import {
  AlertClassesInterface,
  AlertFileMaintenanceService,
  AlertMatrixInterface,
} from './services/alert-file-maintenance.service';
import { Button } from 'primeng/button';

interface AlertClasses {}

@Component({
  selector: 'tenant-alert-file-maintenance',
  imports: [SharedDataTableComponent, SharedPanelContainerComponent, Button],
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
  constructor(private alertFileMaintenanceservice: AlertFileMaintenanceService) {}

  ngOnInit(): void {
    this.alertClassesLoading = true;
    this.alertClasses = this.alertFileMaintenanceservice.getAlertClasses();
    this.alertClassesTotalRecords = this.alertClasses.length; // Set the total count
    this.alertClassesLoading = false;

    this.alertMatrixLoading = true;
    this.alertMatrix = this.alertFileMaintenanceservice.getAlertMatrix();
    this.alertMatrixTotalRecords = this.alertMatrix.length;
    this.alertMatrixLoading = false;
  }

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
}
