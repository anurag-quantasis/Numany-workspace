import { Component, inject } from '@angular/core';
import { BedStore } from './bed-store/bed.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnDef, CustomInputComponent, ShortcutDirective, ShortcutService, SharedPanelContainerComponent } from 'shared-ui';
import { Observable, Subscription } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Bed } from './bed-store/beds.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BedService } from './services/beds.service';
import { SharedDataTableComponent } from 'shared-ui';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'tenant-beds',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    ConfirmDialogModule,
    ShortcutDirective,
    SharedDataTableComponent,
    CustomInputComponent,
    Toast,
    SharedPanelContainerComponent
],
  templateUrl: './beds.component.html',
  styleUrl: './beds.component.css',
  providers: [BedStore, MessageService, ConfirmationService],
})
export class BedsComponent {
  // Inject the store. Because it's provided above, a new instance is created.
  readonly store = inject(BedStore);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly shortcutService = inject(ShortcutService);
  // @ViewChild('pTable') pTable!: Table;
  private keyNavSubscription = new Subscription();
  isAddDialogVisible = false;

  // Form for adding a new bed
  bedForm = this.fb.group({
    bedId: ['', Validators.required],
    area: ['', Validators.required],
    section: [null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(9998)]],
  });

  readonly columns: ColumnDef<Bed>[] = [
    { field: 'id_Bed', header: 'Bed Id',filter: { type: 'text', placeholder: 'Search by name' }, },
    { field: 'id_Area', header: 'Area',filter: { type: 'text', placeholder: 'Search by name' }, },
    { field: 'ip_Sec', header: 'Section',filter: { type: 'text', placeholder: 'Search by name' }, },
    { field: 'patientName', header: 'Name',filter: { type: 'text', placeholder: 'Search by name' }, },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Register all our keyboard navigation shortcuts.
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowdown', () => this.navigateSelection('down')),
    );
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowup', () => this.navigateSelection('up')),
    );
    this.keyNavSubscription.add(
      // The shortcut now calls the new, simplified method
      this.shortcutService.on('arrowright', () => this.navigatePage('next')),
    );
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowleft', () => this.navigatePage('previous')),
    );
  }

  // Method to be called by the PrimeNG table's (onLazyLoad) event
  loadBeds(event: TableLazyLoadEvent) {
    this.store.loadBeds(event);
  }

  showAddDialog() {
    this.bedForm.reset();
    this.isAddDialogVisible = true;
  }

  // onSelectionChange(bed: Bed) {
  //   console.log('Selected Bed:', bed);
  //   this.store.selectBed(bed);
  // }

  handleSelectionChange(bed: Bed | null): void {
    // The event now emits a single object, not an array.
    this.store.setSelection(bed);
  }

  saveNewBed() {
    if (this.bedForm.invalid) {
      return;
    }
    const formValue = this.bedForm.getRawValue();

    const newBedPayload = {
      name: formValue.bedId,
      area: formValue.area,
      // We are certain `section` is a number because the form is valid.
      section: formValue.section!,
    };
    this.store.addBed(newBedPayload);
    this.isAddDialogVisible = false;
  }

  confirmDelete() {
    const bedToDelete = this.store.selectedBed();

    console.log('Bed select', bedToDelete);
    if (!bedToDelete) {
      return;
    }

    this.confirmationService.confirm({
      key: 'delete-bed-confirmation',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      message: `Are you sure you want to delete "${bedToDelete.id_Area}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // If the user clicks "Yes", call the deleteBed method in the store.
        this.store.deleteBed(bedToDelete.id);
      },
    });
  }

  /** Navigates the selected row up or down. */
  navigateSelection(direction: 'up' | 'down'): void {
    const currentBeds = this.store.beds();
    if (currentBeds.length === 0) return;

    const selected = this.store.selectedBed();
    const currentIndex = selected ? currentBeds.findIndex((b) => b.id === selected.id) : -1;

    let newIndex = 0;
    if (direction === 'down') {
      newIndex = currentIndex >= currentBeds.length - 1 ? 0 : currentIndex + 1; // Wraps to top
    } else {
      // 'up'
      newIndex = currentIndex <= 0 ? currentBeds.length - 1 : currentIndex - 1; // Wraps to bottom
    }

    // this.store.selectBed(currentBeds[newIndex]);
  }

  /** Navigates to the next or previous page in the paginator. */
  navigatePage(direction: 'next' | 'previous'): void {
    this.store.paginate(direction);
  }
}
