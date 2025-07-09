import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
// import { AuthStore } from '../../../core/auth/auth-store/auth.store';

@Component({
  selector: 'tenant-header',
  imports: [ButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styles: ``,
})
export class TenantHeaderComponent {
  private readonly router = inject(Router);
  // readonly store = inject(AuthStore);

  logout() {
    // this.store.logout();
    // this.router.navigateByUrl('/login');
  }
}
