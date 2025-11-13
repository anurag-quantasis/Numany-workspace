import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SharedPanelContainerComponent, CustomInputComponent } from 'shared-ui';
import { PhysicianStore } from './physician-store/physician.store';
import { Physician } from './physician-store/physician.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
    ConfirmDialog,
  ],
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css'],
  providers: [PhysicianStore, ConfirmationService],
})
export class PhysicianComponent implements OnInit {
  readonly store = inject(PhysicianStore);
  private fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  physician!: FormGroup;
  isAddMode = signal(false);

  constructor() {
    this.initializeForm();
    effect(() => {
      const physicians = this.store.physician();
      const selectedId = this.physician.get('selectedName')?.value;
      if (selectedId && !physicians.some((p) => p.id_doc === selectedId)) {
        this.resetForm(false);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadPhysician();
    this.physician.get('selectedName')?.valueChanges.subscribe((selectedId) => {
      if (selectedId && !this.isAddMode()) {
        const physicianData = this.store.physician().find((p) => p.id_doc === selectedId);
        if (physicianData) {
          this.physician.patchValue(physicianData, { emitEvent: false });
        }
      } else if (!selectedId) {
        this.resetForm(false);
      }
    });
  }

  private initializeForm(): void {
    this.physician = this.fb.group({
      selectedName: [null],
      id_doc: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      hide_dr: [false],
      e_rx_yn: [false],
      nam_doc: ['', [Validators.required, Validators.maxLength(30)]],
      adr_doc: ['', Validators.maxLength(50)],
      cty_doc: ['', Validators.maxLength(50)],
      st_doc: ['', Validators.maxLength(2)],
      zip_doc: ['', Validators.maxLength(20)],
      dea_no: ['', Validators.maxLength(50)],
      phone: ['', Validators.maxLength(14)],
      st_lic: ['', Validators.maxLength(20)],
      up_in: ['', Validators.maxLength(20)],
      npi: ['', Validators.maxLength(20)],
      m_care_dr: ['', Validators.maxLength(20)],
      m_caid_dr: ['', Validators.maxLength(20)],
      local_id: ['', Validators.maxLength(20)],
    });
  }

  private resetForm(enterAddMode: boolean): void {
    this.physician.reset({
      id_doc: { value: '', disabled: !enterAddMode },
      hide_dr: false,
      e_rx_yn: false,
    });
    this.physician.get('selectedName')?.setValue(null, { emitEvent: false });

    this.isAddMode.set(enterAddMode);
  }

  enterAddMode(): void {
    this.resetForm(true);
  }

  cancelAddMode(): void {
    this.resetForm(false);
  }

  onUpdate(): void {
    const { selectedName, ...physicianPayload } = this.physician.getRawValue();
    if (!physicianPayload.id_doc) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a physician to update.',
        styleClass: 'border-none bg-white',
      });
      return;
    }
    this.store.updatePhysician(physicianPayload as Physician);
  }

  onDelete(): void {
    const physicianId = this.physician.get('id_doc')?.value;
    const physicianName = this.physician.get('nam_doc')?.value;

    if (!physicianId) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a physician to delete.',
      });
      return;
    } else {
      this.confirmationService.confirm({
        key: 'delete-physician-confirmation',
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
        message: `Are you sure you want to delete ${physicianName}`,
        header: 'Confirm Deletion',
        icon: 'pi pi-trash',
        accept: () => {
          this.store.deletePhysician(physicianId);
        },
      });
    }
  }

  onSave(): void {
    if (this.physician.invalid) {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'info',
        summary: 'Info',
        detail: 'Please fill out all required fields.',
        styleClass: 'bg-white border-none',
      });
      return;
    }
    const { selectedName, ...physicianPayload } = this.physician.getRawValue();
    this.store.addNewPhysician(physicianPayload as Physician);
    this.cancelAddMode();
  }
}
