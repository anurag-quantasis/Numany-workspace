import { Component } from '@angular/core';
import { HeaderBarComponent } from '../../../../../shared-ui/src/lib/components/header-bar/header-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tenant-layout',
  imports: [HeaderBarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
