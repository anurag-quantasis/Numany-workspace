import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShortcutDirective } from '../../directives/shortcut.directive';
import { ShortcutKeyHintDirective } from '../../directives/shortcut-key-hint.directive';
import { InputTextModule } from 'primeng/inputtext';

interface CustomMenuItem extends MenuItem {
  shortcut?: string; // e.g., 'Ctrl+S'
  items?: CustomMenuItem[];
}

@Component({
  selector: 'shared-header-bar',
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MenubarModule,
    BadgeModule,
    InputTextModule,
    ShortcutDirective,
  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css',
})
export class HeaderBarComponent implements OnInit {
  items: CustomMenuItem[] = [];
  ngOnInit() {
    this.items = [
      // UCO List
      {
        label: 'UCO List',
        icon: 'pi pi-fw pi-file',
        shortcut: undefined,
        command: () => {
          console.log('Helloooo from first');
        },
        items: [
          {
            label: 'Show Unconfirmed Order List',
            icon: 'pi pi-fw pi-plus',
            shortcut: 'ctrl.u',
            shortcutLabel: '⌘+u',
            shortcutHint: 'u',
            command: () => {
              console.log('Unconfrimed List');
            },
          },
        ],
      },
      // Patients
      {
        label: 'Patients',
        icon: 'pi pi-fw pi-file',
        shortcut: 'alt.p',
        shortcutLabel: 'alt+p',
        shortcutHint: 'p',
      },
      // Report
      {
        label: 'Reports',
        shortcut: 'alt.r',
        shortcutLabel: 'alt+r',
        shortcutHint: 'R',
        // styleClass: 'scrollable-submenu',
        items: [
          {
            label: 'Active Order Profile',
            shortcut: 'alt.r a',
            shortcutLabel: 'A',
            shortcutHint: 'A',
            command: () => {
              console.log('Active Order Profile clicked');
            },
          },
          {
            label: 'Census',
            shortcut: 'alt.r c',
            shortcutHint: 'C',
            command: () => {
              console.log('Census clicked');
            },
          },
          {
            label: 'Dispensing Transaction Reports',
            shortcut: 'alt.r d',
            shortcutHint: 'D',
            command: () => {
              console.log('Dispensing Transaction Reports clicked');
            },
          },
          {
            label: 'Med Fill',
            shortcut: 'ctrl.m', // This is a direct shortcut, not a chain
            shortcutLabel: 'Ctrl+M',
            shortcutHint: 'M',
            command: () => {
              console.log('Med Fill clicked');
            },
          },
          {
            label: 'IV Fill',
            shortcut: 'ctrl.i',
            shortcutLabel: 'Ctrl+I',
            shortcutHint: 'I',
            command: () => {
              console.log('IV Fill clicked');
            },
          },
          {
            label: 'Financial',
            shortcut: 'alt.r f',
            shortcutLabel: 'F',
            shortcutHint: 'F',
            command: () => {
              console.log('Financial');
            },
            items: [
              {
                label: 'Daily Charges',
                shortcut: 'alt.r f d',
                shortcutLabel: 'D',
                shortcutHint: 'd',
                command: () => {
                  console.log('Daily Charges');
                },
              },
              {
                label: 'Formulary Repricing',
                shortcut: 'alt.r f f',
                shortcutLabel: 'F',
                shortcutHint: 'f',
                command: () => {
                  console.log('Formulary Repricing');
                },
              },
              {
                label: 'Ward Cost Summary',
                shortcut: 'alt.r f w',
                shortcutLabel: 'W',
                shortcutHint: 'w',
                command: () => {
                  console.log('Ward Cost Summary');
                },
              },
              {
                label: 'Financial Modeling Report',
                shortcut: 'alt.r f m',
                shortcutLabel: 'M',
                shortcutHint: 'm',
                command: () => {
                  console.log('Financial Modeling Report');
                },
              },
              {
                label: 'Submit TP Building',
                shortcut: 'alt.r f s',
                shortcutLabel: 'S',
                shortcutHint: 's',
                command: () => {
                  console.log('Submit TP Building');
                },
              },
            ],
          },
          {
            label: 'Management',
            shortcut: 'alt.r m', // Using 'm' to avoid conflict with 'Active Order Profile' ('a')
            shortcutHint: 'M',
            items: [
              /* Add management sub-items here */
            ],
          },
          {
            label: 'MAR',
            shortcut: 'ctrl.r', // Direct shortcut
            shortcutLabel: 'Ctrl+R',
            shortcutHint: 'R',
            command: () => {
              console.log('MAR clicked');
            },
          },
          {
            label: 'Miscellaneous',
            shortcut: 'alt.r i', // Using 'i' from miscellaneous
            shortcutHint: 'i',
            items: [
              /* Add miscellaneous sub-items here */
            ],
          },
          {
            label: 'Renewal List',
            shortcut: 'alt.r w', // Using 'w' from renewal
            shortcutHint: 'w',
            command: () => {
              console.log('Renewal List clicked');
            },
          },
          {
            label: 'Recovery Utilities',
            shortcut: 'alt.r u',
            shortcutHint: 'U',
            items: [
              /* Add recovery sub-items here */
            ],
          },
          {
            label: 'EMAR Reports',
            shortcut: 'alt.r e',
            shortcutHint: 'E',
            command: () => {
              console.log('EMAR Reports clicked');
            },
          },
          {
            label: 'Utilization Review',
            shortcut: 'alt.r t', // Using 't' from utilization to avoid conflict with 'Recovery Utilities' ('u')
            shortcutHint: 'U',
            command: () => {
              console.log('Utilization Review clicked');
            },
          },
          {
            label: 'Misc Specialty Reports',
            shortcut: 'f6', // Direct shortcut for function key
            shortcutLabel: 'F6',
            command: () => {
              console.log('Misc Specialty Reports clicked');
            },
          },
        ],
      },
      // EDIT
      {
        label: 'Edit',
        shortcut: 'alt.e',
        shortcutLabel: 'alt+e',
        shortcutHint: 'E',
        command: () => {
          console.log('\clicked');
        },

        items: [
          {
            label: 'Batch Charge Adjustments',
            shortcut: 'alt.e b',
            shortcutLabel: 'B',
            shortcutHint: 'B',
            command: () => {
              console.log('Batch Charge Adjustments clicked');
            },
          },
          {
            label: 'Floor Stock Charging',
            shortcut: 'ctrl.s',
            shortcutLabel: 'Ctrl+S',
            shortcutHint: 'S',
            command: () => {
              console.log('Floor Stock Charging clicked');
            },
          },
          {
            label: 'Interdept Transfers',
            shortcut: 'alt.e f2',
            shortcutLabel: 'F2',
            shortcutHint: 'F2',
            command: () => {
              console.log('Interdept Transfers clicked');
            },
          },
          {
            label: 'Update Med OE Fill Thru Date/Time',
            shortcut: 'alt.e u',
            shortcutLabel: 'U',
            shortcutHint: 'U',
            command: () => {
              console.log('Update Med OE Fill Thru Date/Time clicked');
            },
          },
          {
            label: 'Zero Units Charged on TEST Patients',
            shortcut: 'alt.e z',
            shortcutLabel: 'Z',
            shortcutHint: 'Z',
            command: () => {
              console.log('Zero Units Charged on TEST Patients clicked');
            },
          },
        ],
      },
      // Files
      {
        label: 'Files',
        shortcut: 'alt.f',
        shortcutLabel: 'alt+f',
        shortcutHint: 'f',
        // styleClass: 'scrollable-submenu',
        items: [
          {
            label: 'Administration Schedules',
            shortcut: 'alt.f a',
            shortcutHint: 'A',
            command: () => {
              console.log('Administration Schedules clicked');
            },
          },
          {
            label: 'Bed/Ward',
            shortcut: 'alt.f b',
            shortcutHint: 'B',
            shortcutLabel: 'B',
            route: '/bed',
            // command: () => { console.log('Bed/Ward clicked'); },
          },
          {
            label: 'Charge Algorithm',
            shortcut: 'alt.f c',
            shortcutHint: 'C',
            command: () => {
              console.log('Charge Algorithm clicked');
            },
          },
          {
            label: 'Department Names',
            command: () => {
              console.log('Department Names clicked');
            },
          },
          {
            label: 'Drug',
            shortcut: 'alt.f d',
            shortcutHint: 'd',
            command: () => {
              console.log('Drug clicked');
            },
            items: [],
          },
          {
            label: 'Financial Reporting Groups',
            shortcut: 'alt.f f',
            shortcutHint: 'F',
            command: () => {
              console.log('Financial Reporting Groups clicked');
            },
          },
          {
            label: 'Patient/Payor Type',
            // shortcut: 'alt.f p',
            // shortcutHint: 'P',
            command: () => {
              console.log('Patient/Payor Type clicked');
            },
          },
          {
            label: 'Pharmacist Intervention Setup',
            // shortcut: 'alt.f v',
            // shortcutHint: 'V',
            command: () => {
              console.log('Pharmacist Intervention Setup clicked');
            },
            items: [],
          },
          {
            label: 'Physician',
            shortcut: 'alt.f y',
            shortcutHint: 'Y',
            command: () => {
              console.log('Physician clicked');
            },
          },
          {
            label: 'Printer/Report Selection',
            shortcut: 'f8',
            shortcutLabel: 'F8',
            command: () => {
              console.log('Printer/Report Selection clicked');
            },
          },
          {
            label: 'Route Codes',
            shortcut: 'alt.f r',
            shortcutHint: 'R',
            command: () => {
              console.log('Route Codes clicked');
            },
          },
          {
            label: 'Sig Codes',
            // shortcut: 'alt.f s',
            // shortcutHint: 'S',
            command: () => {
              console.log('Sig Codes clicked');
            },
          },
          {
            label: 'Sig Parts',
            // shortcut: 'alt.f t',
            // shortcutHint: 'T',
            command: () => {
              console.log('Sig Parts clicked');
            },
          },
          {
            label: 'Site Parameters',
            shortcut: 'alt.f t',
            shortcutHint: 't',
            command: () => {
              console.log('SiteParameters clicked');
            },
          },
          {
            label: 'Standing Orders',
            shortcut: 'alt.f s',
            shortcutHint: 's',
            command: () => {
              console.log('Standing Orders clicked');
            },
          },
          {
            label: 'Vendor/Supplier',
            shortcut: 'alt.f v',
            shortcutHint: 'v',
            command: () => {
              console.log('Vendor/Supplier clicked');
            },
          },
          {
            label: 'Ward/Bed Area Cost Centers',
            shortcut: 'alt.f w',
            shortcutHint: 'w',
            command: () => {
              console.log('Ward/Bed Area Cost Centers');
            },
          },
          {
            label: 'Database Users',
            shortcut: 'alt.f u',
            shortcutHint: 'u',
            command: () => {
              console.log('Ward/Bed Area Cost Centers');
            },
          },
          {
            label: 'Export Patients and Active Orders to Interface',
            // shortcut: 'alt.f e',
            // shortcutHint: 'E',
            command: () => {
              console.log('Export Patients and Active Orders clicked');
            },
          },
          {
            label: 'Lab Result Types',
            // shortcut: 'alt.f l',
            // shortcutHint: 'L',
            command: () => {
              console.log('Lab Result Types clicked');
            },
          },
          {
            label: 'Import Diagnosis File Update',
            // shortcut: 'alt.f i',
            // shortcutHint: 'I',
            command: () => {
              console.log('Import Diagnosis File Update clicked');
            },
          },
          {
            label: 'Alert File Matrix',
            shortcut: 'alt.f x',
            shortcutHint: 'x',
            command: () => {
              console.log('Alert File Matrix clicked');
            },
          },
          {
            label: 'Remote Inventory Location IDs',
            shortcut: 'alt.f r',
            shortcutHint: 'R',
            command: () => {
              console.log('Remote Inventory Location IDs clicked');
            },
          },
          {
            label: 'Third Party Provider Data',
            shortcut: 'alt.f t',
            shortcutHint: 'T',
            command: () => {
              console.log('Third Party Provider Data clicked');
            },
            disabled: true, // Grayed out in image
          },
          {
            label: 'Backup Current Database',
            // shortcut: '',
            shortcutHint: 'B',
            command: () => {
              console.log('Backup Current Database clicked');
            },
          },
          {
            label: 'Restore Database',
            shortcut: 'alt.f s',
            shortcutHint: 'S',
            command: () => {
              console.log('Restore Database clicked');
            },
            disabled: true, // Grayed out
          },
          {
            label: 'Print/Display Data Dictionary',
            shortcut: 'alt.f d',
            shortcutHint: 'D',
            command: () => {
              console.log('Print/Display Data Dictionary clicked');
            },
            disabled: true, // Grayed out
          },
          {
            label: 'Merge Patients',
            shortcut: 'alt.f m',
            shortcutHint: 'M',
            command: () => {
              console.log('Merge Patients clicked');
            },
          },
          {
            label: 'Initialize/Update Next Dose Time for EMAR',
            shortcut: 'alt.f n',
            shortcutHint: 'N',
            command: () => {
              console.log('Initialize/Update Next Dose Time for EMAR clicked');
            },
          },
        ],
      },
    ];
  }

  // This handler is crucial to preserve the original 'command' functionality
  handleItemClick(event: MouseEvent, item: CustomMenuItem) {
    // If the item has a command, execute it
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // Note: PrimeNG handles routerLink, url, and submenu toggling automatically
    // when the click event propagates to its internal handlers.
  }
  handleButton() {
    console.log('hello');
  }
}
