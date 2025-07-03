import { Component } from '@angular/core';
import { ShortcutKeyHintDirective } from '../../core/directive/shortcut-key-hint.directive';
import { ShortcutDirective } from '../../core/directive/shortcut.directive';

@Component({
  selector: 'app-settings',
  imports: [ShortcutDirective, ShortcutKeyHintDirective],
  templateUrl: './settings.component.html',
  styles: ``,
})
export class SettingsComponent {
  openFileMenu() {
    console.log('Alt+f triggered: Cancelling operation...');
  }
}
