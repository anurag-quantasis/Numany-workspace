import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'shared-header-bar',
  imports: [MenubarModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css',
})
export class HeaderBarComponent {
  items = [
    { label: 'UCO List', icon: 'pi pi-list', items: [{ label: 'View UCO', items:[{label: 'UCO'}] }] },
    { label: 'Patient', icon: 'pi pi-user' },
    { label: 'Reports', icon: 'pi pi-chart-line' },
    { label: 'Edit', icon: 'pi pi-pencil' },
    {
      label: 'Files',
      icon: 'pi pi-file',
      items: [{ label: 'Bed Management', routerLink: '/beds' }, { label: 'Departments', routerLink: '/departments' }, { label: 'Charge Cost' }],
    },
    { label: 'Inventory', icon: 'pi pi-box' },
    { label: 'Help', icon: 'pi pi-question' },
  ];
}
