import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SharedDataTableComponent, ColumnDef } from 'shared-ui';
import { RouterLink } from '@angular/router';

interface DrugItem {
  drugId: string;
  primaryName: string;
  size: string;
  suppName: string;
  secondaryName: string;
  formularly: string;
  ndc: string;
  gpi: string;
}

@Component({
  selector: 'tenant-item-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedDataTableComponent],
  templateUrl: './item-maintenance.component.html',
  styleUrl: './item-maintenance.component.css',
})
export class ItemMaintenanceComponent {
  form: FormGroup;

  MOCK_ITEMS: DrugItem[] = Array.from({ length: 12 }, (_, i) => ({
    drugId: `D${i + 1}`,
    primaryName: `Drug ${i + 1}`,
    size: `${100 + i * 10}mg`,
    suppName: `Supplier ${i + 1}`,
    secondaryName: `Alt Name ${i + 1}`,
    formularly: i % 2 === 0 ? 'OTC' : 'Rx',
    ndc: `10000-2000${i}-0${i}`,
    gpi: `123456789012${i.toString().padStart(2, '0')}`,
  }));

  readonly columns: ColumnDef<any>[] = [
    { field: 'drugId', header: 'Drug ID' },
    { field: 'primaryName', header: 'Primary Name' },
    { field: 'size', header: 'Size' },
    { field: 'suppName', header: 'Supplier' },
    { field: 'secondaryName', header: 'Secondary Name' },
    { field: 'formularly', header: 'Formularly' },
    { field: 'ndc', header: 'NDC' },
    { field: 'gpi', header: 'GPI' },
  ];

  filteredItems: DrugItem[] = [];

  constructor() {
    const controls: Record<string, FormControl> = {};
    this.columns.forEach((col) => {
      controls[col.field] = new FormControl('');
    });
    this.form = new FormGroup(controls);

    // Initial filter
    this.filteredItems = [...this.MOCK_ITEMS];

    // Subscribe to changes
    this.form.valueChanges.subscribe(() => this.onFilterChange());
  }

  onFilterChange() {
    const filters = this.form.value;
    this.filteredItems = this.MOCK_ITEMS.filter((item) =>
      this.columns.every((col) => {
        const filterValue = (filters[col.field] ?? '').toLowerCase();
        return (
          !filterValue ||
          (item[col.field as keyof DrugItem] ?? '').toString().toLowerCase().includes(filterValue)
        );
      }),
    );
  }

  handleClick() {
    console.log(this.MOCK_ITEMS);
  }
}
