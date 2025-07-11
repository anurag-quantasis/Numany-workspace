import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../core/auth/auth-store/auth.store';

@Component({
  selector: 'main-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  authStore = inject(AuthStore);

  ngOnInit(){
    console.log("AUTH STORE VALUE",this.authStore.token());
  }
}
