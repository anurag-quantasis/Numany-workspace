import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandedButtonComponent } from "shared-ui";
import { ButtonModule } from "primeng/button";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BrandedButtonComponent, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tenant-numany';

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
    }
  }
}
