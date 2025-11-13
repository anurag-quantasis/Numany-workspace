import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../../core/auth/auth-store/auth.store';
// import { AuthStore } from '../../../core/auth/auth-store/auth.store';

@Component({
  selector: 'tenant-header',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styles: ``,
})
export class TenantHeaderComponent implements OnInit {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  // readonly store = inject(AuthStore);

  logout() {
    // this.store.logout();
    // this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    console.log(this.authStore);
  }

  logOut(): void {
    this.authStore.logout();
  }
}
