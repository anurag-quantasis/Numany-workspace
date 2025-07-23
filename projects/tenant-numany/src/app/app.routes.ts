import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/tenant-login/tenant-login.component').then((m) => m.TenantLoginComponent),
  },

  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/patients/patients.component').then((m) => m.PatientsComponent),
  },

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
      // {
      //   path: 'expiration',
      //   loadComponent: () => import('./features/drugs/expiration/expiration.component').then(m => m.ExpirationComponent)
      // },
      {
        path: 'item-maintenance',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/drugs/item-maintenance/item-maintenance.component').then(
                (m) => m.ItemMaintenanceComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './features/drugs/item-maintenance/item-maintenance-form/item-maintenance-form.component'
              ).then((m) => m.ItemMaintenanceFormComponent),
          },
        ],
      },
      {
        path: 'formulary-items',
        loadComponent: () =>
          import('./features/select-formulary-items/select-formulary-items.component').then(
            (m) => m.SelectFormularyItemsComponent,
          ),
      },
      {
        path: 'physician',
        loadComponent: () =>
          import('./features/physician/physician.component').then((m) => m.PhysicianComponent),
      },
      {
        path: 'site-parameters',
        loadComponent: () =>
          import('./features/site-parameters/site-parameters.component').then(
            (m) => m.SiteParametersComponent,
          ),
      },
      {
        path: 'pharmacist-intervention-type-maintainance',
        loadComponent: () =>
          import(
            './features/pharmcist-intervention-type/pharmcist-intervention-type.component'
          ).then((m) => m.PharmcistInterventionTypeComponent),
      },
      {
        path: 'pharmacist-intervention-type',
        loadComponent: () =>
          import(
            './features/pharmcist-intervention-type/pharmcist-intervention-type.component'
          ).then((m) => m.PharmcistInterventionTypeComponent),
      },
      {
        path: 'vendor-supplier',
        loadComponent: () =>
          import('./features/vendor-supplier/vendor-supplier.component').then(
            (m) => m.VendorSupplierComponent,
          ),
      },

      {
        path: 'lab-result-type-maintenance',
        loadComponent: () =>
          import(
            './features/lab-result-type-maintenance/lab-result-type-maintenance.component'
          ).then((m) => m.LabResultTypeMaintenanceComponent),
      },

      {
        path: 'remote-inventory-location',
        loadComponent: () =>
          import('./features/remote-inventory-location/remote-inventory-location.component').then(
            (m) => m.RemoteInventoryLocationComponent,
          ),
      },
      {
        path: 'patient-payor-type-maintenance',
        loadComponent: () =>
          import(
            './features/patient-payor-type-maintenance/patient-payor-type-maintenance.component'
          ).then((m) => m.PatientPayorTypeMaintenanceComponent),
      },

      {
        path: 'standing-orders',
        loadComponent: () =>
          import('./features/standing-orders/standing-orders.component').then(
            (m) => m.StandingOrdersComponent,
          ),
      },
      {
        path: 'alert-file-matrix',
        loadComponent: () =>
          import('./features/alert-file-maintenance/alert-file-maintenance.component').then(
            (m) => m.AlertFileMaintenanceComponent,
          ),
      },
      {
        path: 'ward-bed-area-maintenanace',
        loadComponent: () =>
          import('./features/ward-bed-area-maintenance/ward-bed-area-maintenance.component').then(
            (m) => m.WardBedAreaMaintenanceComponent,
          ),
      },
       {
        path: 'database-users',
       loadComponent: () => import('./features/database-users/database-users.component').then(m => m.DatabaseUsersComponent)
      },
    ],
  },
];
