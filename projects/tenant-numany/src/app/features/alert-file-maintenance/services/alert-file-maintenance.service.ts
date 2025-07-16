import { Injectable } from '@angular/core';

export interface AlertClassesInterface {
  id: string;
  class_name: string;
  msg_name: string;
  message: string;
  check_type: number;
  check_field: string;
  criteria: string;
  value_1: number;
  value_2: number;
}

export interface AlertMatrixInterface {
  id_drug: string;
  name: string;
  class: string;
  msg_name: string;
  message: string;
  alt_chk_type: number;
  alt_chk_field: string;
  alt_operator: '<' | '>' | '';
  alt_chk_val1: number;
  alt_chk_val2: number;
}

@Injectable({ providedIn: 'root' })
export class AlertFileMaintenanceService {
  getAlertClasses(): AlertClassesInterface[] {
    return [
      {
        id: 'str-01',
        class_name: 'Flu',
        msg_name: 'Mediguide',
        message: 'Give mediguid with this med',
        check_type: 0,
        check_field: '',
        criteria: '',
        value_1: 0,
        value_2: 0,
      },
      {
        id: 'str-02',
        class_name: 'LoopDiuretics',
        msg_name: 'Diuretic-Aminoglyc',
        message: 'Do not use loop diuretics along with nephrotoxic meds',
        check_type: 2,
        check_field: '',
        criteria: 'Exists',
        value_1: 0,
        value_2: 0,
      },
      {
        id: 'str-03',
        class_name: 'No Scr',
        msg_name: 'No Scr',
        message: 'No serum creatanine found',
        check_type: 1,
        check_field: '',
        criteria: 'Not Exists',
        value_1: 0,
        value_2: 0,
      },
      {
        id: 'str-04',
        class_name: 'NSAIDS',
        msg_name: 'Mediguide',
        message: 'Give mediguid with this med',
        check_type: 0,
        check_field: '',
        criteria: '',
        value_1: 0,
        value_2: 0,
      },
      {
        id: 'str-04',
        class_name: 'testge',
        msg_name: 'ID Consult',
        message: 'This meds is expensive and must be ordered via an',
        check_type: 3,
        check_field: 'Months',
        criteria: '<',
        value_1: 12,
        value_2: 0,
      },
    ];
  }

  getAlertMatrix(): AlertMatrixInterface[] {
    return [
      {
        id_drug: 'J340',
        name: 'IBUPROFEN 800MG TAB',
        class: 'No Class Specified',
        msg_name: 'Mediguide',
        message: 'Give mediguid with this med',
        alt_chk_type: 3,
        alt_chk_field: 'Years',
        alt_operator: '<',
        alt_chk_val1: 1,
        alt_chk_val2: 0,
      },
      {
        id_drug: 'C029',
        name: 'COUMADIN 5MG TAB',
        class: 'No Class Specified',
        msg_name: 'CoumINR',
        message: 'inr > 5',
        alt_chk_type: 1,
        alt_chk_field: 'INR',
        alt_operator: '>',
        alt_chk_val1: 0,
        alt_chk_val2: 0,
      },
      {
        id_drug: 'ASPI100',
        name: 'ASPIRIN 325MG TAB',
        class: 'No Class Specified',
        msg_name: 'ID Consult',
        message: 'This med is expensive and must be ordered via an',
        alt_chk_type: 5,
        alt_chk_field: 'WARF115',
        alt_operator: '',
        alt_chk_val1: 0,
        alt_chk_val2: 0,
      },
    ];
  }
}
