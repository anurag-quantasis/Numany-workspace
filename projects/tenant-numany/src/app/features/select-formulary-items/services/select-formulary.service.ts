import { Injectable } from '@angular/core';

export interface Product {
  id: string;
  PrimarySecondaryName: string;
  unit: string;
  SecondaryName: string;
  PackSize: number;
  NDCDIN: number;
}

@Injectable({
  providedIn: 'root',
})
export class SelectFormularyService {
  getProducts(): Product[] {
    // Return some mock data
    return [
      {
        id: '1000',
        PrimarySecondaryName: 'A&D CAP',
        unit: '1 CAP',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1001',
        PrimarySecondaryName: 'A&D Ointment New',
        unit: '1 CAP',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1002',
        PrimarySecondaryName: 'A+D PRESO LOT',
        unit: '120 ML',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1003',
        PrimarySecondaryName: 'A+D PRESO MIS CARE WIP',
        unit: '1 CHW',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1004',
        PrimarySecondaryName: 'A THRU Z CHW SELECT',
        unit: '1 TAB',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1005',
        PrimarySecondaryName: 'A THRU Z TAB ADVANCED',
        unit: '1 TAB',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1006',
        PrimarySecondaryName: 'A THRU Z TAB HIGH POT',
        unit: '1 TAB',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
      {
        id: '1007',
        PrimarySecondaryName: 'A THRU Z TAB ADVANTAG',
        unit: '1 TAB',
        SecondaryName: '',
        PackSize: 100,
        NDCDIN: 123456,
      },
    ];
  }
}
