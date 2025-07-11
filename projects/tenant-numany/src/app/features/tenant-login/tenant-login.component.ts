import { Component, inject, OnInit } from '@angular/core';
import { CustomInputComponent } from 'shared-ui';
import { Button } from 'primeng/button';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../core/auth/auth-store/auth.store';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'tenant-tenant-login',
  standalone: true,
  imports: [CustomInputComponent, Button, ReactiveFormsModule],
  templateUrl: './tenant-login.component.html',
})
export class TenantLoginComponent implements OnInit {
  loginForm!: FormGroup;
  readonly authStore = inject(AuthStore);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isLoading = this.authStore.isLoading;
  readonly error = this.authStore.error;

  constructor() {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authStore.login(this.loginForm.value);
      // console.log(this.authStore)
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}
