import { HttpParams } from "@angular/common/http";
import { FilterMetadata } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";

export function createHttpParams(event: TableLazyLoadEvent): HttpParams {
  let params = new HttpParams();

  // 1. Handle Pagination (Assuming this is still needed)
  const page = Math.floor(event.first ?? 0) / (event.rows ?? 10) + 1;
  const size = event.rows ?? 10;
  params = params.set('pageNumber', page.toString());
  params = params.set('pageSize', size.toString());

  // 2. Handle OData Sorting
  if (event.sortField && typeof event.sortField === 'string') {
    const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc';
    // OData standard sort format is 'field direction'
    params = params.set('$orderby', `${event.sortField} ${sortDirection}`);
  }

  // 3. Handle OData Filtering (THE MAIN FIX)
  const filterClauses: string[] = [];

  if (event.filters) {
    for (const field in event.filters) {
      const filterMeta = event.filters[field] as FilterMetadata | FilterMetadata[];

      // PrimeNG can send a single or an array of filters
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

  // Join all individual clauses with 'and' and add to the '$filter' parameter
  if (filterClauses.length > 0) {
    params = params.set('filter', filterClauses.join(' and '));
  }

  return params;
}

/**
 * Helper to create a single OData clause from PrimeNG filter metadata.
 */
export function createODataClause(field: string, filter: FilterMetadata): string | null {
  const value = filter.value;
  const matchMode = filter.matchMode || 'contains'; // Default to 'contains'

  // For strings, wrap in single quotes and escape any existing single quotes
  const formatString = (val: string) => `'${val.replace(/'/g, "''")}'`;

  switch (matchMode) {
    // String functions
    case 'contains':
      return `contains(tolower(${field}), tolower(${formatString(value)}))`;
    case 'notContains':
      return `not contains(tolower(${field}), tolower(${formatString(value)}))`;
    case 'startsWith':
      return `startswith(tolower(${field}), tolower(${formatString(value)}))`;
    case 'endsWith':
      return `endswith(tolower(${field}), tolower(${formatString(value)}))`;

    // Equality
    case 'equals':
    case 'eq':
      return `${field} eq ${typeof value === 'string' ? formatString(value) : value}`;
    case 'notEquals':
    case 'ne':
      return `${field} ne ${typeof value === 'string' ? formatString(value) : value}`;

    // Relational
    case 'lt':
      return `${field} lt ${value}`;
    case 'lte':
      return `${field} le ${value}`;
    case 'gt':
      return `${field} gt ${value}`;
    case 'gte':
      return `${field} ge ${value}`;

    // We don't handle other modes by default
    default:
      console.warn(`OData mapping for matchMode '${matchMode}' is not implemented.`);
      return null;
  }
}