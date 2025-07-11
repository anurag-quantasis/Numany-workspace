import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  input,
  output,
  TemplateRef,
  Directive,
  inject,
  Signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterType = 'text' | 'numeric' | 'boolean' | 'select' | 'multi-select' | 'custom';

export interface FilterConfig<T> {
  type: FilterType;
  matchMode?: 'contains' | 'equals' | 'in' | 'startsWith'; // Add more as needed
  placeholder?: string;
  options?: any[]; // For select/multi-select
  optionLabel?: string; // For select/multi-select
  optionValue?: string; // For select/multi-select
  // The key for providing a fully custom filter template from the parent
  customFilterKey?: string; 
}

export interface ColumnDef<T> {
  // The key in your data object (e.g., 'name', 'customer.id')
  field: string;

  // The text to display in the table header
  header: string;
  // Optional: for custom styling like width
  style?: { [klass: string]: any };

  filter?: FilterConfig<T>;
  // Optional key for providing a custom BODY cell template
  customBodyKey?: string;
}

// PrimeNG Modules
import { TableModule, TableLazyLoadEvent, Table } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

// A simple directive to help us grab named templates
@Directive({
  selector: '[appColumnTemplate]',
  standalone: true,
})
export class ColumnTemplateDirective {
  // The 'appColumnTemplate' input will match the column's 'field'
  name = input.required<string>({ alias: 'appColumnTemplate' });

  // CORRECTED: Inject the TemplateRef instead of making it an input.
  // The `inject()` function will automatically get the <ng-template> this directive is attached to.
  readonly template: TemplateRef<any> = inject(TemplateRef);

  // Alternative (classic constructor injection):
  // constructor(public readonly template: TemplateRef<any>) {}
}

@Directive({
  selector: 'ng-template[customTemplate]', // Selects <ng-template customTemplate ...>
  standalone: true,
})
export class CustomTemplateDirective {
  // Distinguishes between a filter template and a body cell template
  type = input<'filter' | 'body'>('body', { alias: 'customTemplate' });
  
  // The unique key that links this template to a ColumnDef
  key = input.required<string>();

  // The directive injects the template it's attached to
  templateRef = inject(TemplateRef<any>);
}

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    SelectButtonModule,
    TagModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-datatable.component.html',
  styleUrl: './shared-datatable.component.css'
})
export class SharedDataTableComponent<T extends { id: any }> implements AfterContentInit {
  // --- Required Inputs ---
  /** The data to display for the current page. */
  data = input.required<T[]>();
  /** The configuration for the table columns. */
  columns = input.required<ColumnDef<T>[]>();
  /** The total number of records in the dataset (for pagination). */
  totalRecords = input.required<number>();
  /** The loading state of the table. */
  loading = input.required<boolean>();

  // --- Optional Inputs with Defaults ---
  /** The number of rows to display per page. */
  rows = input<number>(5);
  /** The index of the first row to be displayed. */
  first = input<number>(0);
  /** The options for rows per page dropdown. */
  rowsPerPageOptions = input<number[]>([5, 10, 20, 50]);
  /** Defines the selection behavior. Can be 'single', 'multiple', or null to disable. */
  selectionMode = input<'single' | 'multiple' | null>('single');
  /** The currently selected item(s). */
  selection = input<T | T[] | null>(null);
  /** The property to use as a unique key for rows. */
  dataKey = input<string>('id');
  /** Message to display when there is no data. */
  emptyMessage = input<string>('No records found.');
  /** The option to conditionally render the table action space. */
  tableActions = input<boolean>(false);
  /** The option to conditionally render the table in Grid mode. */
  showGridLne = input<boolean>(false);
  /** The option to conditionally render Order Column. */
  showOrder = input<boolean>(false);
  /** The minimum number of rows to display visually, padding with empty rows if needed.*/
  minRows = input<number | null>(5);

  // --- Outputs ---
  /** Emits when lazy loading is triggered (pagination, sorting). */
  lazyLoad = output<TableLazyLoadEvent>();
  /** Emits when a row selection changes. */
  selectionChange = output<T | T[] | null>();


  // --- Derived State ---
  protected colspan: Signal<number> = computed(() => {
    const selectionCol = this.selectionMode() === 'multiple' ? 1 : 0;
    
    const indexCol = this.showOrder() ? 1 : 0; 
    
    return this.columns().length + selectionCol + indexCol;
  });

  /**
   * Determines if the filter row should be rendered at all.
   * This is true only if at least one column has a filter configuration.
   */
  protected isAnyColumnFilterable: Signal<boolean> = computed(() =>
    this.columns().some(col => !!col.filter)
  );

   @ContentChildren(CustomTemplateDirective)
  private customTemplates!: QueryList<CustomTemplateDirective>;

  protected customFilterTemplateMap = new Map<string, TemplateRef<any>>();
  protected customBodyTemplateMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    // The QueryList gives us the instances of the directive.
    for (const directiveInstance of this.customTemplates) {
      
      // --- FIX: Read the signal's value by calling it as a function ---
      if (directiveInstance.type() === 'filter') { // Changed d.type to d.type()
        
        // --- FIX: Read the signal's value by calling it as a function ---
        this.customFilterTemplateMap.set(
          directiveInstance.key(), // Changed d.key to d.key()
          directiveInstance.templateRef
        );

      } else {

        // --- FIX: Read the signal's value by calling it as a function ---
        this.customBodyTemplateMap.set(
          directiveInstance.key(), // Changed d.key to d.key()
          directiveInstance.templateRef
        );
      }
    }
  }

   // --- METHODS ---
  /**
   * Type-safe method to handle filter events from the template.
   * This avoids logic and type-casting ($any) in the HTML.
   * @param event The DOM input event.
   * @param table The PrimeNG Table instance.
   * @param field The field to filter on.
   */
  onFilter(event: Event, table: Table, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    table.filter(inputElement.value, field, 'contains');
  }

  /**
   * Helper function to get a value from a nested object property.
   * e.g., getNestedValue(item, 'customer.name')
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  /**
   * Calculates the number of empty placeholder rows needed to meet the `minRows` requirement.
   */
  protected placeholderRowCount = computed(() => {
    const min = this.minRows() ?? this.rows(); // Default to page size if not set
    const dataLength = this.data().length;
    
    // Only add placeholders if the data count is less than the minimum
    if (dataLength > 0 && dataLength < min) {
      return min - dataLength;
    }
    
    // If there's no data, the "emptymessage" template will show, so we don't need placeholders.
    // If data is full, we don't need placeholders.
    return 0;
  });

  /**
   * Creates an array to be used with the @for block for rendering placeholders.
   */
  protected placeholderRowsArray = computed(() => {
    // Creates an array of a specific length, e.g., [undefined, undefined, undefined]
    return Array(this.placeholderRowCount());
  });
}
 