import { Component, OnInit } from '@angular/core';
import { ColumnDef, SharedDataTableComponent } from 'shared-ui';
import { Button } from 'primeng/button';
import {
  AlertClassesInterface,
  AlertFileMaintenanceService,
  AlertMatrixInterface,
} from '../../../../alert-file-maintenance/services/alert-file-maintenance.service';

@Component({
  selector: 'tenant-list-alert',
  imports: [SharedDataTableComponent, Button],
  templateUrl: './list-alert.component.html',
  styleUrl: './list-alert.component.css',
})
export class ListAlertComponent implements OnInit {
  alertMatrix: AlertMatrixInterface[] = [];
  alertMatrixLoading = false;
  alertMatrixTotalRecords = 0;
  constructor(private alertFileMaintenanceservice: AlertFileMaintenanceService) {}
  readonly alertMatrixColumns: ColumnDef<AlertClassesInterface>[] = [
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

  loadAlertMatrix(): void {
    this.alertMatrixLoading = true;
    this.alertMatrix = this.alertFileMaintenanceservice.getAlertMatrix();
    this.alertMatrixTotalRecords = this.alertMatrix.length;
    this.alertMatrixLoading = false;
  }

  ngOnInit(): void {
    this.loadAlertMatrix();
  }
}
