import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

interface Physician {
  id: number | string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  DEA: string;
  phone: string;
  license: string;
  UPIN: string;
  npi: string;
  fax: string;
  medicad: string;
  localid: string;
  isHidden: boolean;
  isPrescriber: boolean;
}

@Component({
  selector: 'main-physician',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {
  physician!: FormGroup;
  // Store doctors locally
  doctors: Physician[] = [];

  names = [
    { name: 'Dr. Smith', id: 1 },
    { name: 'Dr. Jones', id: 2 },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.physician = this.fb.group({
      selectedName: [null],
      id: [''],
      isHidden: [false],
      isPrescriber: [false],
      name: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      DEA: [''],
      phone: [''],
      license: [''],
      UPIN: [''],
      npi: [''],
      fax: [''],
      medicad: [''],
      localid: ['']
    });
  }

  // Add a new physician to the list
  onAdd(): void {
    const formValue = this.physician.value;
    if (!formValue.name) {
      alert('Name is required to add a physician.');
      return;
    }
    // Simple id generation if empty or duplicate
    const newId = formValue.id || (this.doctors.length ? Math.max(...this.doctors.map(d => +d.id)) + 1 : 1);
    const exists = this.doctors.find(d => d.id == newId);
    if (exists) {
      alert(`Physician with ID ${newId} already exists. Use update instead.`);
      return;
    }

    const newPhysician: Physician = {
      id: newId,
      name: formValue.name,
      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      zip: formValue.zip,
      DEA: formValue.DEA,
      phone: formValue.phone,
      license: formValue.license,
      UPIN: formValue.UPIN,
      npi: formValue.npi,
      fax: formValue.fax,
      medicad: formValue.medicad,
      localid: formValue.localid,
      isHidden: formValue.isHidden,
      isPrescriber: formValue.isPrescriber
    };

    this.doctors.push(newPhysician);
    alert('Physician added successfully!');
    this.physician.reset();
  }

  // Update existing physician by id
  onUpdate(): void {
    const formValue = this.physician.value;
    const id = formValue.id;
    if (!id) {
      alert('ID is required to update a physician.');
      return;
    }

    const index = this.doctors.findIndex(d => d.id == id);
    if (index === -1) {
      alert(`Physician with ID ${id} not found.`);
      return;
    }

    this.doctors[index] = {
      id: id,
      name: formValue.name,
      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      zip: formValue.zip,
      DEA: formValue.DEA,
      phone: formValue.phone,
      license: formValue.license,
      UPIN: formValue.UPIN,
      npi: formValue.npi,
      fax: formValue.fax,
      medicad: formValue.medicad,
      localid: formValue.localid,
      isHidden: formValue.isHidden,
      isPrescriber: formValue.isPrescriber
    };

    alert('Physician updated successfully!');
    this.physician.reset();
  }

  // Delete physician by id
  onDelete(): void {
    const id = this.physician.value.id;
    if (!id) {
      alert('ID is required to delete a physician.');
      return;
    }

    const index = this.doctors.findIndex(d => d.id == id);
    if (index === -1) {
      alert(`Physician with ID ${id} not found.`);
      return;
    }

    this.doctors.splice(index, 1);
    alert('Physician deleted successfully!');
    this.physician.reset();
  }
}
