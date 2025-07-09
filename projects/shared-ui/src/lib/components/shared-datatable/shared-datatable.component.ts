import { Component, ContentChildren, QueryList, AfterContentInit, input, output, TemplateRef, Directive, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDef<T> {
  // The key in your data object (e.g., 'name', 'customer.id')
  field: string;
  // The text to display in the table header
  header: string;
  // Optional: for custom styling like width
  style?: { [klass: string]: any };
}

// PrimeNG Modules
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CardModule } from 'primeng/card';

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

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule],
  templateUrl: './shared-datatable.component.html',
  
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
  rowsPerPageOptions = input<number[]>([5 ,10 , 20, 50]);
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

  // --- Outputs ---
  /** Emits when lazy loading is triggered (pagination, sorting). */
  lazyLoad = output<TableLazyLoadEvent>();
  /** Emits when a row selection changes. */
  selectionChange = output<T | T[] | null>();

  // --- For Custom Cell Templates ---
  // This is an advanced but powerful feature for customization
  @ContentChildren(ColumnTemplateDirective)
  customTemplates!: QueryList<ColumnTemplateDirective>;

  public customTemplateMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit() {
    // After the view is initialized, we map the custom templates by their field name
    this.customTemplates.forEach(directive => {
      this.customTemplateMap.set(directive.name(), directive.template);
    });
  }

  /**
   * Helper function to get a value from a nested object property.
   * e.g., getNestedValue(item, 'customer.name')
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}