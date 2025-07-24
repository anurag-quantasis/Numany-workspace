import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedPanelContainerComponent } from 'shared-ui';
import { CustomInputComponent } from 'shared-ui';
import { InterventionTypesStore } from './intervention-types-store/intervention-types.store';
import { InterventionTypes } from './intervention-types-store/intervention-types.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'tenant-intervention-types',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    FieldsetModule,
    SharedPanelContainerComponent,
    CustomInputComponent,
    ConfirmDialog,
  ],
  templateUrl: './intervention-types.component.html',
  styleUrl: './intervention-types.component.css',
  providers: [InterventionTypesStore, ConfirmationService],
})
export class InterventionTypesComponent implements OnInit {
  private fb = inject(FormBuilder);
  store = inject(InterventionTypesStore);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  interventionForm!: FormGroup;
  isAddingMode = signal(false);
  interventionOptions = computed(() => {
    return this.store.interventionTypes().map((type) => ({
      name: `${type.description}`,
      value: type.pi_id,
    }));
  });

  constructor() {
    this.buildForm();
    effect(() => {
      const types = this.store.interventionTypes();
      const selectedId = this.interventionForm.get('pi_id')?.value;
      if (selectedId && !types.some((t) => t.pi_id === selectedId)) {
        this.interventionForm.reset();
      }
    });

    this.interventionForm
      .get('selectedIntervention')
      ?.valueChanges.pipe(
        takeUntilDestroyed(),
        filter((id) => !!id),
      )
      .subscribe((selectedId: string) => {
        const selectedType = this.store.interventionTypes().find((t) => t.pi_id === selectedId);
        if (selectedType) {
          this.interventionForm.patchValue(selectedType);
        }
      });
  }

  ngOnInit(): void {
    this.store.loadInterventionTypes();
  }

  private buildForm(): void {
    this.interventionForm = this.fb.group({
      selectedIntervention: [null],
      pi_id: ['', [Validators.required, Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.maxLength(50)]],
      pi_hide: [false],
      sl_me: [false],
      cl_me: [false],
      sc_me: [false],
      pc_me: [false],
      sl_adr: [false],
      adr_type: [false],
      acuity: [false],
      fi: [false],
      oc: [false],
    });
  }

  onNew(): void {
    this.isAddingMode.set(true);
    this.interventionForm.reset({ pi_hide: false });
    this.interventionForm.get('selectedIntervention')?.disable();
    this.interventionForm.get('pi_id')?.enable();
  }

  onCancel(): void {
    this.isAddingMode.set(false);
    this.interventionForm.reset();
    this.interventionForm.get('selectedIntervention')?.enable();
  }

  onSave(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      console.warn('Form is invalid');
      return;
    }
    const formValue = this.interventionForm.getRawValue();
    delete formValue.selectedIntervention;
    this.messageService.add({
      key: 'custom-toast',
      severity: 'success',
      summary: 'Successful',
      detail: 'Successfully Added',
      styleClass: 'border-none bg-white',
    });
    this.store.addNewInterventionTypes(formValue as InterventionTypes);
    this.onCancel();
  }

  onUpdate(): void {
    if (!this.interventionForm.get('pi_id')?.value) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a Intervention Type to modify.',
        styleClass: 'border-none bg-white',
      });
      return;
    }

    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      console.warn('Form is invalid for update');
      return;
    }

    const formValue = this.interventionForm.getRawValue();
    delete formValue.selectedIntervention;

    this.store.updateInterventionTypes(formValue as InterventionTypes);
    this.messageService.add({
      key: 'custom-toast',
      severity: 'info',
      summary: 'Info',
      detail: 'Updated Successfully.',
      styleClass: 'border-none bg-white',
    });
  }

  onDelete(): void {
    const idToDelete = this.interventionForm.get('pi_id')?.value;
    if (!idToDelete) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select an intervention type to delete.',
        styleClass: 'border-none bg-white',
      });
      return;
    }
    this.confirmationService.confirm({});
    this.confirmationService.confirm({
      key: 'delete-interventionType-confirmation',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
      },
      message: `Are you sure you want to delete ${idToDelete}`,
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      accept: () => {
        this.store.deleteInterventionTypes(idToDelete);
      },
    });
  }
}
