import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Product, SelectFormularyService } from './services/select-formulary.service';
import { SharedPanelContainerComponent } from 'shared-ui';

@Component({
  selector: 'tenant-select-formulary-items',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    SharedPanelContainerComponent,
  ],
  templateUrl: './select-formulary-items.component.html',
  styleUrl: './select-formulary-items.component.css',
})
export class SelectFormularyItemsComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  products: Product[] = [];
  selectedProducts: Product[] = [];

  // These are the fields we will allow global search on
  globalFilterFields = ['Primary Name', 'Secondary Name'];

  constructor(private selectFormularyService: SelectFormularyService) {}

  ngOnInit() {
    this.products = this.selectFormularyService.getProducts();
  }

  onGlobalFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(filterValue, 'contains');
  }

  onSelectionChange(value = []) {
    this.selectedProducts = value;
    console.log('Selected products:', this.selectedProducts);
  }

  // Optimization: track items by their unique ID
  trackById(index: number, item: Product): string {
    return item.id;
  }
}
