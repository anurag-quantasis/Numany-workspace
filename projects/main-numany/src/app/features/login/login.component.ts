import { CommonModule } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '../../core/auth/auth-store/auth.store';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'main-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  // Inject the NonNullableFormBuilder
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly messageService = inject(MessageService);

  // The rest of your component is the same...
  loginForm = this.fb.group({
    // With NonNullableFormBuilder, these controls are now typed as FormControl<string>
    // instead of FormControl<string | null>
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    // Effect to reactively navigate on successful login
    effect(() => {
      if (this.store.isAuthenticated()) {
        // Use untracked to prevent the effect from re-running if the router state changes
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!',
          styleClass: 'border-none bg-white',
        });

        untracked(() => {
          this.router.navigateByUrl('/');
        });
        console.log("this.store.isAuthenticated()", this.store.isAuthenticated());
      }
    });

    effect(() => {
      const errorMessage = this.store.error();
      console.log("errorMessage", errorMessage);

      // Only trigger the toast if there is an actual error message.
      if (errorMessage) {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Please check your Credentials',
          life: 3000 // Toast will disappear after 3 seconds
        });
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.store.login(this.loginForm.getRawValue());
    }
  }
}
