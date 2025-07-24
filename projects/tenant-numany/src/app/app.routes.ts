import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

import { authGuard } from './core/auth/guard/auth.guard';
import { roleGuard } from './core/auth/guard/role.guard';
import { AppRoles } from './shared/utils/tenant.constants';
import { RoutePaths } from './shared/utils/route-path';

export const routes: Routes = [
  {
    path: RoutePaths.Login,
    loadComponent: () =>
      import('./features/tenant-login/tenant-login.component').then((m) => m.TenantLoginComponent),
  },

  {
    path: RoutePaths.Patients,
    loadComponent: () =>
      import('./features/patients/patients/patients.component').then((m) => m.PatientsComponent),
  },

  {
    path: RoutePaths.Layout,
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: RoutePaths.Bed,
        loadComponent: () => import('./features/beds/beds.component').then((m) => m.BedsComponent),
      },
      {
        path: RoutePaths.AdminSchedules,
        loadComponent: () =>
          import('./features/administration-schedules/administration-schedules.component').then(
            (m) => m.AdministrationSchedulesComponent,
          ),
      },
      {
        path: RoutePaths.ChargeAlgorithm,
        canActivate: [roleGuard([AppRoles.SuperAdmin])],
        loadComponent: () =>
          import('./features/charge-algorithm/charge-algorithm.component').then(
            (m) => m.ChargeAlgorithmComponent,
          ),
      },
      {
        path: RoutePaths.Departments,
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent,
          ),
      },
      {
        path: RoutePaths.ReportSelection,
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
        path: RoutePaths.ItemMaintenance,
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
        path: RoutePaths.FormularyItems,
        loadComponent: () =>
          import('./features/select-formulary-items/select-formulary-items.component').then(
            (m) => m.SelectFormularyItemsComponent,
          ),
      },
      {
        path: RoutePaths.Physician,
        loadComponent: () =>
          import('./features/physician/physician.component').then((m) => m.PhysicianComponent),
      },
      {
        path: RoutePaths.SiteParameters,
        loadComponent: () =>
          import('./features/site-parameters/site-parameters.component').then(
            (m) => m.SiteParametersComponent,
          ),
      },
      {
        path: RoutePaths.PharmInterventionTypeMaintenance,
        loadComponent: () =>
          import(
            './features/pharmcist-intervention-type/pharmcist-intervention-type.component'
          ).then((m) => m.PharmcistInterventionTypeComponent),
      },
      {
        path: RoutePaths.PharmInterventionType,
        loadComponent: () =>
          import(
            './features/pharmcist-intervention-type/pharmcist-intervention-type.component'
          ).then((m) => m.PharmcistInterventionTypeComponent),
      },
      {
        path: RoutePaths.VendorSupplier,
        loadComponent: () =>
          import('./features/vendor-supplier/vendor-supplier.component').then(
            (m) => m.VendorSupplierComponent,
          ),
      },

      {
        path: RoutePaths.LabResultTypeMaintenance,
        loadComponent: () =>
          import(
            './features/lab-result-type-maintenance/lab-result-type-maintenance.component'
          ).then((m) => m.LabResultTypeMaintenanceComponent),
      },

      {
        path: RoutePaths.RemoteInventoryLocation,
        loadComponent: () =>
          import('./features/remote-inventory-location/remote-inventory-location.component').then(
            (m) => m.RemoteInventoryLocationComponent,
          ),
      },
      {
        path: RoutePaths.PatientPayorTypeMaintenance,
        loadComponent: () =>
          import(
            './features/patient-payor-type-maintenance/patient-payor-type-maintenance.component'
          ).then((m) => m.PatientPayorTypeMaintenanceComponent),
      },

      {
        path: RoutePaths.StandingOrders,
        loadComponent: () =>
          import('./features/standing-orders/standing-orders.component').then(
            (m) => m.StandingOrdersComponent,
          ),
      },
      {
        path: RoutePaths.AlertFileMatrix,
        loadComponent: () =>
          import('./features/alert-file-maintenance/alert-file-maintenance.component').then(
            (m) => m.AlertFileMaintenanceComponent,
          ),
      },
      {
        path: RoutePaths.WardBedAreaMaintenance,
        loadComponent: () =>
          import('./features/ward-bed-area-maintenance/ward-bed-area-maintenance.component').then(
            (m) => m.WardBedAreaMaintenanceComponent,
          ),
      },
      {
        path: RoutePaths.DatabaseUsers,
        loadComponent: () =>
          import('./features/database-users/database-users.component').then(
            (m) => m.DatabaseUsersComponent,
          ),
      },
    ],
  },
];
