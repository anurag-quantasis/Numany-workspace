import { HttpParams } from '@angular/common/http';
import { FilterMetadata } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

/**
 * Creates the OData sort and filter strings from a PrimeNG event.
 */
export function createODataParams(event: TableLazyLoadEvent): {
  oDataFilter?: string;
  oDataSort?: string;
} {
  // 1. Handle Sorting
  let oDataSort: string | undefined;
  if (event.sortField && typeof event.sortField === 'string') {
    const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    oDataSort = `${event.sortField} ${sortDirection}`;
  }

  // 2. Handle Filtering
  const filterClauses: string[] = [];
  if (event.filters) {
    for (const field in event.filters) {
      const filterMeta = event.filters[field] as FilterMetadata | FilterMetadata[];
      const filters = Array.isArray(filterMeta) ? filterMeta : [filterMeta];

      for (const filter of filters) {
        if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
          const clause = createODataClause(field, filter);
          if (clause) {
            filterClauses.push(clause);
          }
        }
      }
    }
  }

  const oDataFilter = filterClauses.length > 0 ? filterClauses.join(' and ') : undefined;

  return { oDataFilter, oDataSort };
}

/**
 * Helper to create a single OData clause from PrimeNG filter metadata.
 */
export function createODataClause(field: string, filter: FilterMetadata): string | null {
  const value = filter.value;
  // Default to 'contains' for text, but 'equals' for other types unless specified.
  const matchMode = filter.matchMode || 'contains';

  const formatString = (val: any) => `'${String(val).replace(/'/g, "''")}'`;

  switch (matchMode) {
    case 'startsWith':
      return `startswith(tolower(${field}), tolower(${formatString(value)}))`;
    case 'contains':
      return `contains(tolower(${field}), tolower(${formatString(value)}))`;
    case 'notContains':
      return `not contains(tolower(${field}), tolower(${formatString(value)}))`;
    case 'endsWith':
      return `endswith(tolower(${field}), tolower(${formatString(value)}))`;
    case 'equals':
    case 'eq':
      // Handle boolean and numeric types correctly without quotes
      if (typeof value === 'boolean' || typeof value === 'number') {
        return `${field} eq ${value}`;
      }
      return `${field} eq ${formatString(value)}`;
    case 'notEquals':
    case 'ne':
      if (typeof value === 'boolean' || typeof value === 'number') {
        return `${field} ne ${value}`;
      }
      return `${field} ne ${formatString(value)}`;
    case 'lt':
      return `${field} lt ${value}`;
    case 'lte':
      return `${field} le ${value}`;
    case 'gt':
      return `${field} gt ${value}`;
    case 'gte':
      return `${field} ge ${value}`;
    // Add other cases like 'in' if needed
    default:
      console.warn(`OData mapping for matchMode '${matchMode}' is not implemented.`);
      return null;
  }
}
