import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../../core/auth/auth-store/auth.store';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  logout() {
    this.store.logout();
    this.router.navigateByUrl('/login');
  }
}
