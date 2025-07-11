import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { SharedDataTableComponent, ColumnDef } from 'shared-ui';
import { InventoryItem } from './remote-inventory-store/remote-inventory.model';
import { RemoteInventoryLocationStore } from './remote-inventory-store/remote-inventory.store';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-remote-inventory-location',
  standalone: true,
  templateUrl: './remote-inventory-location.component.html',
  imports: [
    CommonModule,
    SelectModule,
    DividerModule,
    CardModule,
    SharedDataTableComponent,
    ButtonModule,
    ReactiveFormsModule
  ],
})
export class RemoteInventoryLocationComponent {
  remoteInventoryLocation: FormGroup;

  locationIDs = [
    { name: '2E' },
    { name: '3NORTH' },
    { name: 'adm machin' },
    { name: 'BSONMERP' },
    { name: 'CICU' },
  ];

  readonly columns: ColumnDef<InventoryItem>[] = [
    { field: 'medName', header: 'MEDs in Remote' },
    { field: 'unit', header: 'UNIT' },
    { field: 'bin', header: 'BIN' },
    { field: 'qtyLoaded', header: 'Qty Loaded' },
    { field: 'lastLoaded', header: 'Last Loaded' },
    { field: 'expires', header: 'Expires' },
  ];

  constructor(private fb: FormBuilder, public store: RemoteInventoryLocationStore) {
    this.remoteInventoryLocation = this.fb.group({
      locationID: [null, [Validators.required, Validators.maxLength(10)]],
      binID: ['', Validators.maxLength(10)],
      qtyLoaded: ['', Validators.pattern(/^[0-9]*$/)],
      lastLoaded: ['', this.dateValidator()],
      expires: ['', this.dateValidator()],
    });
  }

  get selectedLocation() {
    return this.remoteInventoryLocation.value.locationID;
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const isValid = !isNaN(Date.parse(control.value));
      return isValid ? null : { invalidDate: true };
    };
  }

  handleSelectionChange(selected: InventoryItem) {
    this.store.selectItem(selected);
  }

  onAddItem() {
    if (this.remoteInventoryLocation.invalid) return;
    const form = this.remoteInventoryLocation.value;

    this.store.addItem({
      id: crypto.randomUUID(),
      medName: 'New Medication',
      unit: '1 TAB',
      bin: form.binID || '',
      qtyLoaded: form.qtyLoaded || '',
      lastLoaded: form.lastLoaded || '',
      expires: form.expires || '',
    });
  }

  onDeleteItem() {
    this.store.deleteSelected();
  }

  onChangeLocationID() {
    const newID = prompt('Enter new Location ID (max 10 chars):');
    if (!newID || newID.length > 10) return alert('Invalid ID.');
    this.remoteInventoryLocation.patchValue({ locationID: newID });
  }
}
