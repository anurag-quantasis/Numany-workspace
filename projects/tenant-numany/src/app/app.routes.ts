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
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent,
          ),
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
}

    ],
  },
];
