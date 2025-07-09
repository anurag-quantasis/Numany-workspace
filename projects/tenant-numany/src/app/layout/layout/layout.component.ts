import { Component } from '@angular/core';
import { HeaderBarComponent } from '../../../../../shared-ui/src/lib/components/header-bar/header-bar.component';
import { RouterOutlet } from '@angular/router';
import { TenantHeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'tenant-layout',
  imports: [HeaderBarComponent, RouterOutlet, TenantHeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
