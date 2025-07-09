import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'bed',
        loadComponent: () => import('./features/beds/beds.component').then((m) => m.BedsComponent),
      },
      {
        path: 'charge-algorithm',
        loadComponent: () =>
          import('./features/charge-algorithm/charge-algorithm.component').then(
            (m) => m.ChargeAlgorithmComponent,
          ),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent,
          ),
      },
      {
        path: 'item-maintenance',
        children: [
          {
            // This route matches '/item-maintenance'
            // It will show the list of items.
            path: '',
            loadComponent: () =>
              import('./features/drugs/item-maintenance/item-maintenance.component').then(
                (m) => m.ItemMaintenanceComponent,
              ),
          },
          {
            // This route matches '/item-maintenance/new' or '/item-maintenance/123'
            // The ':id' is a route parameter that will hold 'new' or the actual item ID.
            path: ':id',
            loadComponent: () =>
              import(
                './features/drugs/item-maintenance/item-maintenance-form/item-maintenance-form.component'
              ).then((m) => m.ItemMaintenanceFormComponent),
          },
        ],
      },
    ],
  },
];
