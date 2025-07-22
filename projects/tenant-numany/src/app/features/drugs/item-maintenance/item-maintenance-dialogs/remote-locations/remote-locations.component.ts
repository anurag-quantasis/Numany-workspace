import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// PrimeNG Module Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

// Interface for our dropdown options for better type safety
interface LocationOption {
  name: string;
  code: string;
}

@Component({
  selector: 'tenant-remote-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './remote-locations.component.html',
  styleUrls: ['./remote-locations.component.css'],
})
export class RemoteLocationComponent implements OnInit {
  // The main form group that holds our form array
  inventoryForm!: FormGroup;

  // Options for the "Location ID" dropdown
  locationOptions: LocationOption[] = [
    { name: 'Warehouse A - Dock 1', code: 'WHA-D1' },
    { name: 'Warehouse A - Dock 2', code: 'WHA-D2' },
    { name: 'Warehouse B - Section 5', code: 'WHB-S5' },
    { name: 'Retail Store Front', code: 'RET-F1' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with an empty FormArray
    this.inventoryForm = this.fb.group({
      locations: this.fb.array([]),
    });
  }

  /**
   * Getter for easy access to the locations FormArray in the template.
   */
  get locations(): FormArray {
    return this.inventoryForm.get('locations') as FormArray;
  }

  /**
   * Creates a new FormGroup representing a single row in the table.
   * This includes validators for required fields.
   */
  createLocationRow(): FormGroup {
    return this.fb.group({
      locationId: [null, [Validators.required]],
      bin: ['', [Validators.required]],
      qtyLoad: [null, [Validators.required, Validators.min(1)]],
      lastUploaded: [new Date().toISOString().split('T')[0]], // Default to today
      expires: [''],
    });
  }

  /**
   * Adds a new, empty row to the top of the table.
   */
  addLocation(): void {
    this.locations.insert(0, this.createLocationRow());
  }

  /**
   * Removes a specific row from the table by its index.
   * @param index The index of the row to remove.
   */
  deleteLocation(index: number): void {
    this.locations.removeAt(index);
  }

  /**
   * Handles the form submission.
   * It logs the form's validity and its data.
   */
  saveInventory(): void {
    // Mark all fields as touched to trigger validation messages
    this.inventoryForm.markAllAsTouched();

    if (this.inventoryForm.invalid) {
      console.error('Form is invalid. Please fill out all required fields.');
      return;
    }

    console.log('Form is valid. Submitting data...');
    console.log(this.inventoryForm.value.locations);
    // In a real app, you would send this data to a service:
    // this.inventoryService.updateLocations(this.inventoryForm.value.locations).subscribe(...);
    alert('Inventory data saved! Check the browser console for the payload.');
  }
}
