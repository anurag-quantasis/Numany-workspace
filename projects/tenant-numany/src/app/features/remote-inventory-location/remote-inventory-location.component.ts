import { Component } from '@angular/core';
import { FormBuilder  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-remote-inventory-location',
  standalone: true,
  templateUrl: './remote-inventory-location.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DividerModule,
    CardModule,
  ],
})
export class RemoteInventoryLocationComponent {
  remoteInventoryLocation: FormGroup;

  locationIDs = [
    { name: 'Option1' },
    { name: 'Option2' },
    { name: 'Option3' },
    { name: 'Option4' },
    { name: 'Option5' }
  ];

  constructor(private fb: FormBuilder) {
    this.remoteInventoryLocation = this.fb.group({
      locationID: [null, Validators.required],
    });
  }
}
