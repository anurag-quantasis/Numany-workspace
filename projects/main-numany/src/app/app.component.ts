import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { ShortcutDirective } from './core/directive/shortcut.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, ShortcutDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'main-numany';
}
