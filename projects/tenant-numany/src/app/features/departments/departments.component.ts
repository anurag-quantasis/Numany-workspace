import { Component, OnInit, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ShortcutDirective, SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { Fieldset } from 'primeng/fieldset';
import { DepartmentStore } from './departments-store/department.store';

@Component({
  selector: 'tenant-departments',
  standalone: true,
  imports: [
    SelectModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ShortcutDirective,
    SharedPanelContainerComponent,
    CustomInputComponent,
    Fieldset,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  providers: [DepartmentStore],
})
export class DepartmentsComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly store = inject(DepartmentStore);

  departmentForm!: FormGroup;
  isAddMode = signal(false);
  private isSaving = signal(false);

  constructor() {
    effect(() => {
      const saving = this.isSaving();
      const loading = this.store.isLoading();

      if (saving && !loading) {
        this.isSaving.set(false);

        if (!this.store.error()) {
          console.log('Save successful, resetting UI.');
          this.cancelAddMode();
        } else {
          console.error('Save failed. UI not reset.');
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.store.loadDepartments();
    this.departmentForm.get('department')!.valueChanges.subscribe((selectedId) => {
      if (selectedId && !this.isAddMode()) {
        const dept = this.store.department().find((d) => d.id === selectedId);
        if (dept) {
          this.departmentForm.patchValue(dept, { emitEvent: false });
        }
      }
    });
  }

  private initializeForm(): void {
    this.departmentForm = this.fb.group({
      department: [null],
      id: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(6)]],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      address: ['', [Validators.maxLength(80)]],
      city: ['', [Validators.maxLength(50)]],
      state: ['', [Validators.maxLength(2)]],
      zip: ['', [Validators.maxLength(20)]],
      phone: ['', [Validators.maxLength(20)]],
      note: ['', [Validators.maxLength(50)]],
      cost_basis: ['', [Validators.maxLength(2),Validators.pattern(/^(AV|AW|CC|PC)?$/)]],
      markup: [null, Validators.required],
      tax_flag: ['', [Validators.maxLength(1)]],
    });
  }

  private resetForm(isEnteringAddMode: boolean): void {
    this.departmentForm.reset({}, { emitEvent: false });

    if (isEnteringAddMode) {
      this.isAddMode.set(true);
      this.departmentForm.get('department')?.disable();
      this.departmentForm.get('id')?.enable();
    } else {
      this.isAddMode.set(false);
      this.departmentForm.get('department')?.enable();
      this.departmentForm.get('id')?.disable();
    }
  }

  enterAddMode(): void {
    this.resetForm(true);
  }

  cancelAddMode(): void {
    this.resetForm(false);
  }

  saveNewDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const newDepartment = this.departmentForm.getRawValue();
    delete newDepartment.department;

    this.isSaving.set(true);
    this.store.addNewDepartment(newDepartment);
  }

  updateSelectedDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    const updatedDepartment = this.departmentForm.getRawValue();
    delete updatedDepartment.department;

    if (updatedDepartment.id) {
      this.store.updateDepartment(updatedDepartment);
    }
  }

  deleteSelectedDepartment(): void {
    const departmentId = this.departmentForm.get('id')?.value;
    if (departmentId) {
      this.store.deleteDepartment(departmentId);
      this.departmentForm.reset();
      this.store.clearSelectedDepartment();
    }
  }
}
