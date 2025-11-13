import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { AuthStore } from './core/auth/auth-store/auth.store';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, ToasterComponent, DynamicDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tenant-numany';
  private readonly authStore = inject(AuthStore);
  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
    }
  }

  ngOnInit(): void {
    this.authStore.initializeAuth();
  }
}
