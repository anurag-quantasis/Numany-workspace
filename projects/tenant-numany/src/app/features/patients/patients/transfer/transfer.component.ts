import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tenant-transfer',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent {
  transfers = [
    { 
      bedId: 'B001',
       name: 'Tenant A' 
    },
    {
      bedId: 'B002',
      name: 'Tenant B'
    },
    { 
      bedId: 'B003',
       name: 'Tenant C' 
    }
  ];
}
