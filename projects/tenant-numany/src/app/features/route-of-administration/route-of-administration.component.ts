import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerDesignTokens } from '@primeng/themes/types/divider';

interface RouteCode {
  name: string;
  code: string;
  description?: string;
  doseRouteType?: string;
}

interface DoseRouteType {
  name: string;
  code: string;
}

@Component({
  selector: 'tenant-route-of-administration',
  standalone: true,
  imports: [
    CommonModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule
],
  templateUrl: './route-of-administration.component.html'
})
export class RouteOfAdministrationComponent implements OnInit {
  routeForm!: FormGroup;

  routeCodes: RouteCode[] = [
    { name: 'Oral', code: 'OR', description: 'Oral route', doseRouteType: 'A' },
    { name: 'Intravenous', code: 'IV', description: 'Intravenous route', doseRouteType: 'B' },
    { name: 'Topical', code: 'TP', description: 'Topical route' }
  ];

  doseRouteTypes: DoseRouteType[] = [
    { name: 'Type A', code: 'A' },
    { name: 'Type B', code: 'B' },
  ];

  clinicalSysType = 1; // 1 means Dose Route Type required, else not required

  selectedRouteCode?: RouteCode;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.routeForm = this.fb.group({
      selectedRoute: [null],
      routeCode: ['', [Validators.required], [this.routeCodeUniqueValidator.bind(this)]],
      description: ['', Validators.required],
      doseRouteType: ['']
    });

    if (this.isDoseRouteTypeRequired()) {
      this.routeForm.get('doseRouteType')!.setValidators(Validators.required);
    }

    this.routeForm.get('selectedRoute')!.valueChanges.subscribe(code => {
      this.selectedRouteCode = this.routeCodes.find(rc => rc.code === code);
      if (this.selectedRouteCode) {
        // Patch values and disable routeCode input on update
        this.routeForm.patchValue({
          routeCode: this.selectedRouteCode.code,
          description: this.selectedRouteCode.description || '',
          doseRouteType: this.selectedRouteCode.doseRouteType || ''
        });
        this.routeForm.get('routeCode')!.disable();
      } else {
        // New entry - reset and enable routeCode input
        this.routeForm.patchValue({
          routeCode: '',
          description: '',
          doseRouteType: ''
        });
        this.routeForm.get('routeCode')!.enable();
      }
    });
  }

  isDoseRouteTypeRequired(): boolean {
    return this.clinicalSysType === 1;
  }

  routeCodeUniqueValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(resolve => {
      const val = control.value;
      if (!val) {
        resolve(null); // Required validator will handle empty
        return;
      }
      // If updating, allow same code as selectedRoute
      if (this.selectedRouteCode && this.selectedRouteCode.code === val) {
        resolve(null);
        return;
      }
      const exists = this.routeCodes.some(rc => rc.code.toLowerCase() === val.toLowerCase());
      resolve(exists ? { notUnique: true } : null);
    });
  }

  onNew() {
    this.routeForm.reset({
      selectedRoute: null,
      routeCode: '',
      description: '',
      doseRouteType: ''
    });
    this.selectedRouteCode = undefined;
    this.routeForm.get('routeCode')!.enable();
  }

  onDelete() {
    const selectedCode = this.routeForm.get('selectedRoute')!.value;
    if (!selectedCode) {
      alert('Please select a Route Code to delete.');
      return;
    }
    this.routeCodes = this.routeCodes.filter(rc => rc.code !== selectedCode);
    this.onNew();
  }

  onUpdate() {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      return;
    }

    const { selectedRoute, routeCode, description, doseRouteType } = this.routeForm.getRawValue();

    if (!selectedRoute) {
      // Adding new route
      this.routeCodes.push({ name: routeCode, code: routeCode, description, doseRouteType });
    } else {
      // Updating existing
      const index = this.routeCodes.findIndex(rc => rc.code === selectedRoute);
      if (index > -1) {
        this.routeCodes[index] = { name: routeCode, code: routeCode, description, doseRouteType };
      }
    }
    this.routeForm.patchValue({ selectedRoute: routeCode });
    this.routeForm.get('routeCode')!.disable();
  }

  get routeCodeControl() {
    return this.routeForm.get('routeCode')!;
  }

  get descriptionControl() {
    return this.routeForm.get('description')!;
  }

  get doseRouteTypeControl() {
    return this.routeForm.get('doseRouteType')!;
  }
}
