import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { AuthStore } from '../../core/auth/auth-store/auth.store';

@Component({
  selector: 'main-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  store = inject(AuthStore);

  ngOnInit(): void {
    console.log('Du,my', this.store);
  }
}
