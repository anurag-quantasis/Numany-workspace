import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule for *ngIf
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Your Store, Models, and Services
import { BedStore } from './bed-store/bed.store';
import { Bed } from './bed-store/beds.model';
import { ShortcutService } from '../../core/services/shortcut.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

// Shared and PrimeNG UI Modules
import { SharedDataTableComponent, ColumnTemplateDirective, ColumnDef, CustomInputComponent, noNegativeValues } from 'shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'main-beds',
  standalone: true, // <-- Best practice for modern Angular
  imports: [
    CommonModule, // For *ngIf
    ReactiveFormsModule,
    SharedDataTableComponent,
    ColumnTemplateDirective,
    CustomInputComponent,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    CardModule,
  ],
  templateUrl: './beds.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BedStore, MessageService, ConfirmationService],
})
export class BedsComponent implements OnDestroy {
  // --- INJECTIONS ---
  readonly store = inject(BedStore);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly confirmationService = inject(ConfirmationService);
  private readonly shortcutService = inject(ShortcutService);
  private keyNavSubscription = new Subscription();

  // --- COMPONENT STATE ---
  isAddDialogVisible = false;

  // Form for adding a new bed (this remains unchanged)
  bedForm = this.fb.group({
    name: ['', Validators.required],
    area: ['', [Validators.required, noNegativeValues]],
    section: ['', [Validators.required, Validators.minLength(3)]],
  });

  // Column definitions for our generic table (this remains unchanged)
  readonly columns: ColumnDef<Bed>[] = [
    { field: 'name', header: 'Name' },
    { field: 'area', header: 'Area' },
    { field: 'section', header: 'Section' },
    { field: 'id', header: 'Bed ID' },
  ];

  constructor() {
    this.setupShortcuts();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.keyNavSubscription.unsubscribe();
  }

  private setupShortcuts(): void {
    this.keyNavSubscription.add(this.shortcutService.on('arrowdown', () => this.navigateSelection('down')));
    this.keyNavSubscription.add(this.shortcutService.on('arrowup', () => this.navigateSelection('up')));
    // Simplify: have shortcuts call the store directly
    this.keyNavSubscription.add(this.shortcutService.on('arrowright', () => this.store.paginate('next')));
    this.keyNavSubscription.add(this.shortcutService.on('arrowleft', () => this.store.paginate('previous')));
  }

  // --- EVENT HANDLERS ---

  /** Handles selection changes from the generic table. Type-safe for single or multi-select events. */
  handleSelectionChange(event: Bed | Bed[] | null): void {
    const selectionAsArray = !event ? null : Array.isArray(event) ? event : [event];
    this.store.setSelection(selectionAsArray);
  }

  /** Opens the confirmation dialog to delete one or more selected beds. */
  confirmDelete() {
    const selected = this.store.selectedBeds();
    if (selected.length === 0) {
      return;
    }

    const message = selected.length === 1
      ? `Are you sure you want to delete "${selected[0].name}"?`
      : `Are you sure you want to delete these ${selected.length} beds?`;

    this.confirmationService.confirm({
      key: 'delete-bed-confirmation',
      message,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const idsToDelete = selected.map(bed => bed.id);
        this.store.deleteBeds(idsToDelete);
      },
      // ... other confirmation properties
    });
  }

  /** Navigates the "active" selection up or down using arrow keys. */
  navigateSelection(direction: 'up' | 'down'): void {
    const currentBeds = this.store.beds();
    if (currentBeds.length === 0) return;

    // Use the computed signal to find the "active" row
    const firstSelected = this.store.firstSelectedBed(); 
    const currentIndex = firstSelected ? currentBeds.findIndex((b) => b.id === firstSelected.id) : -1;

    // Use modulo for clean, wrapping navigation
    let newIndex = (direction === 'down')
      ? (currentIndex + 1) % currentBeds.length
      : (currentIndex - 1 + currentBeds.length) % currentBeds.length;

    // When navigating with arrows, we select just one item
    this.store.setSelection([currentBeds[newIndex]]);
  }
  
  // --- DIALOG METHODS (Unchanged) ---

  showAddDialog() {
    this.bedForm.reset();
    this.isAddDialogVisible = true;
  }

  saveNewBed() {
    if (this.bedForm.invalid) {
      this.bedForm.markAllAsTouched();
      return;
    }
    this.store.addBed(this.bedForm.getRawValue());
    this.isAddDialogVisible = false;
  }
}