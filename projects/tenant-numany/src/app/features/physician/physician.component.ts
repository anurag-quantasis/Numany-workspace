import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';

interface Physician {
  id: string;
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
  medicare: string;
  medicaId: string;
  localid: string;
  isHidden: boolean;
  isPrescriber: boolean;
}

@Component({
  selector: 'tenant-physician',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    SharedPanelContainerComponent,
    CustomInputComponent,
  ],
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {
  physician!: FormGroup;
  doctors: Physician[] = [];

  names = [
    { name: 'Dr. Smith', id: '1' },
    { name: 'Dr. Jones', id: '2' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.physician = this.fb.group({
      selectedName: [null],
      id: ['', [Validators.required, Validators.maxLength(10)]],
      isHidden: [false],
      isPrescriber: [false],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      address: ['', Validators.maxLength(50)],
      city: ['', Validators.maxLength(50)],
      state: ['', Validators.maxLength(2)],
      zip: ['', Validators.maxLength(20)],
      DEA: ['', Validators.maxLength(50)],
      phone: ['', Validators.maxLength(14)],
      license: ['', Validators.maxLength(20)],
      UPIN: ['', Validators.maxLength(20)],
      npi: ['', Validators.maxLength(20)],
      medicare: ['', Validators.maxLength(20)],
      medicaId: ['', Validators.maxLength(20)],
      localid: ['', Validators.maxLength(20)]
    });
  }

  onAdd(): void {
    const formValue = this.physician.value;

    if (!formValue.id || !formValue.name) {
      alert('Doctor ID and Name are required.');
      return;
    }

    const exists = this.doctors.find((d) => d.id === formValue.id);
    if (exists) {
      alert(`Physician with ID ${formValue.id} already exists. Use Update instead.`);
      return;
    }

    const newDoctor: Physician = { ...formValue };
    this.doctors.push(newDoctor);
    alert('Physician added successfully!');
    this.physician.reset();
  }

  onUpdate(): void {
    const formValue = this.physician.value;
    const doctor = this.doctors.find((d) => d.id === formValue.id);

    if (!doctor) {
      alert(`Physician with ID ${formValue.id} not found.`);
      return;
    }

    Object.assign(doctor, formValue);
    alert('Physician updated successfully!');
    this.physician.reset();
  }

  onDelete(): void {
    const id = this.physician.value.id;

    if (!id) {
      alert('ID is required to delete a physician.');
      return;
    }

    const index = this.doctors.findIndex((d) => d.id === id);
    if (index === -1) {
      alert(`Physician with ID ${id} not found.`);
      return;
    }

    // Simulate backend reference check
    if (this.isPhysicianReferenced(id)) {
      alert('Cannot delete physician. This doctor is referenced in patient or order records.');
      return;
    }

    const visibleDoctors = this.doctors.filter((d) => !d.isHidden);
    if (visibleDoctors.length === 1 && !this.doctors[index].isHidden) {
      alert('Cannot delete the last visible physician.');
      return;
    }

    if (confirm('Are you sure you want to delete this physician?')) {
      this.doctors.splice(index, 1);
      alert('Physician deleted successfully.');
      this.physician.reset();
    }
  }

  isPhysicianReferenced(id: string): boolean {
    // Replace this logic with actual service/database call
    const referencedDoctorIds = ['1', '2']; // mock
    return referencedDoctorIds.includes(id);
  }
}
