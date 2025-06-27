import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'settings', 
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  },

  // --- Routes WITHOUT the Main Layout ---
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  // Wildcard route for a 404 page (optional)
  // { path: '**', component: PageNotFoundComponent }
];
