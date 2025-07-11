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
        path: 'administration-schedules',
        loadComponent: () =>
          import('./features/administration-schedules/administration-schedules.component').then(
            (m) => m.AdministrationSchedulesComponent,
          ),
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
        path: 'report-selection',
        loadComponent: () =>
          import('./features/report-selection/report-selection.component').then(
            (m) => m.ReportSelectionComponent,
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
           {
      path: 'physician',
      loadComponent: () =>
        import('./features/physician/physician.component').then(
          (m) => m.PhysicianComponent,
        )
     },
     {
  path: 'pharmacist-intervention-type-maintainance',
  loadComponent: () =>
    import('./features/pharmcist-intervention-type/pharmcist-intervention-type.component').then(
      
      (m) => m.PharmcistInterventionTypeComponent,
    )
    },
{
  path: 'pharmacist-intervention-type',
  loadComponent: () =>
    import('./features/pharmcist-intervention-type-maintainance/pharmacist-intervention-type-maintenance').then(
      (m) => m.PharmcistInterventionTypeMaintainanceComponent,
    )
},

{
  path: 'route-of-codes',
  loadComponent: () =>
    import('./features/route-of-administration/route-of-administration.component').then(
      (m) => m.RouteOfAdministrationComponent,
    )
},

  {
    path: 'vendor-supplier',
    loadComponent: () =>
      import('./features/vendor-supplier/vendor-supplier.component').then(
        (m) => m.VendorSupplierComponent,
      )
  },

  {
    path: 'lab-result-type-maintenance',
    loadComponent: () =>
      import('./features/lab-result-type-maintenance/lab-result-type-maintenance.component').then(
        (m) => m.LabResultTypeMaintenanceComponent,
      )
  },

  {
    path: 'remote-inventory-location',
    loadComponent: () =>
      import('./features/remote-inventory-location/remote-inventory-location.component').then(
        (m) => m.RemoteInventoryLocationComponent
      )
  }

    ],
  },
];
 