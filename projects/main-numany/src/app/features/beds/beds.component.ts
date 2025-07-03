import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { BedStore } from './bed-store/bed.store';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ShortcutDirective } from '../../core/directive/shortcut.directive';
import { ShortcutKeyHintDirective } from '../../core/directive/shortcut-key-hint.directive';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Bed } from './bed-store/beds.model';
import { Subscription } from 'rxjs';
import { ShortcutService } from '../../core/services/shortcut.service';

@Component({
  selector: 'main-beds',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ShortcutDirective,
    CardModule,
    ConfirmDialogModule,
    ShortcutKeyHintDirective
  ],
  templateUrl: './beds.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    name: ['', Validators.required],
    area: ['', Validators.required],
    section: ['', Validators.required],
  });

  // ngOnInit(): void {
  //   // Initial load. The PrimeNG table will also trigger this with default values.
  //   this.store.loadBeds({ first: 0, rows: 10 });
  // }

   ngAfterViewInit(): void {
    // Register all our keyboard navigation shortcuts.
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowdown', () => this.navigateSelection('down'))
    );
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowup', () => this.navigateSelection('up'))
    );
    this.keyNavSubscription.add(
      // The shortcut now calls the new, simplified method
      this.shortcutService.on('arrowright', () => this.navigatePage('next'))
    );
    this.keyNavSubscription.add(
      this.shortcutService.on('arrowleft', () => this.navigatePage('previous'))
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

  onSelectionChange(bed: Bed) {
    console.log('Selected Bed:', bed);
    this.store.selectBed(bed);
  }

  saveNewBed() {
    if (this.bedForm.invalid) {
      return;
    }
    // The form value matches the NewBed type
    this.store.addBed(this.bedForm.getRawValue());
    this.isAddDialogVisible = false;
  }

  confirmDelete() {
    const bedToDelete = this.store.selectedBed();
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
      message: `Are you sure you want to delete "${bedToDelete.name}"?`,
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
    const currentIndex = selected ? currentBeds.findIndex(b => b.id === selected.id) : -1;

    let newIndex = 0;
    if (direction === 'down') {
      newIndex = currentIndex >= currentBeds.length - 1 ? 0 : currentIndex + 1; // Wraps to top
    } else { // 'up'
      newIndex = currentIndex <= 0 ? currentBeds.length - 1 : currentIndex - 1; // Wraps to bottom
    }

    this.store.selectBed(currentBeds[newIndex]);
  }

  /** Navigates to the next or previous page in the paginator. */
  navigatePage(direction: 'next' | 'previous'): void {
    this.store.paginate(direction);
  }
}
