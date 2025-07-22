import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for pipes
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

// Define the interface for type safety
export interface Order {
  orderedDate: string;
  orderedQty: number;
  receivedDate: string;
  receivedQty: number;
  poNumber: string;
  invoiceCost: number;
  invoiceId: string;
}

@Component({
  selector: 'tenant-order-history',
  standalone: true,
  imports: [
    CommonModule, // Needed for pipes like 'date' and 'currency'
    TableModule, // The PrimeNG TableModule
    InputTextModule,
  ],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css', // We can leave this empty or remove it
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit() {
    // Sample data (in a real app, this would come from a service)
    this.orders = [
      {
        orderedDate: '2023-10-25',
        orderedQty: 150,
        receivedDate: '2023-10-28',
        receivedQty: 150,
        poNumber: 'PO-1001',
        invoiceCost: 1250.75,
        invoiceId: 'INV-A45F',
      },
      {
        orderedDate: '2023-10-22',
        orderedQty: 75,
        receivedDate: '2023-10-25',
        receivedQty: 70,
        poNumber: 'PO-1002',
        invoiceCost: 890.0,
        invoiceId: 'INV-B98C',
      },
      {
        orderedDate: '2023-10-20',
        orderedQty: 200,
        receivedDate: '2023-10-24',
        receivedQty: 200,
        poNumber: 'PO-1003',
        invoiceCost: 2500.5,
        invoiceId: 'INV-D12E',
      },
      {
        orderedDate: '2023-10-18',
        orderedQty: 50,
        receivedDate: '2023-10-21',
        receivedQty: 50,
        poNumber: 'PO-1004',
        invoiceCost: 450.0,
        invoiceId: 'INV-F33G',
      },
    ];
  }
}
