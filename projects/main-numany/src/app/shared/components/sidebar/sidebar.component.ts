import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../core/auth/auth-store/auth.store';
import { PermissionRequirement } from '../../../core/auth/permissions/role';

// Import the directives from your shared UI library
import { ShortcutDirective } from '../../../core/directive/shortcut.directive';
import { ShortcutKeyHintDirective } from '../../../core/directive/shortcut-key-hint.directive';

type MasterSidebarItem = {
  id?: string;
  routeLink?: string;
  icon: string;
  label: string;
  shortcut?: string; // e.g., 'alt.d'
  shortcutHint?: string; // e.g., 'd'
  permission?: PermissionRequirement;
  children?: MasterSidebarItem[];
};

type DisplaySidebarItem = MasterSidebarItem & {
  level: number;
  isParent: boolean;
  expanded?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true, // Make sure your component is standalone
  // Add the shortcut directives to the imports array
  imports: [CommonModule, RouterModule, ShortcutDirective, ShortcutKeyHintDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  private expandedMenus = signal<Set<string>>(new Set());

  // Define shortcut keys and hints for your menu items.
  // private allItems: MasterSidebarItem[] = [
  //   // {
  //   //   routeLink: 'dashboard',
  //   //   icon: 'pi pi-home',
  //   //   label: 'Dashboard',
  //   //   shortcut: 'alt.d',
  //   //   shortcutHint: 'd',
  //   // },
  //   {
  //     routeLink: 'patients',
  //     icon: 'pi pi-users',
  //     label: 'Patients',
  //     permission: { resource: 'patients', action: 'view' },
  //   },
  //   {
  //     icon: 'pi pi-file',
  //     label: 'Files',
  //     shortcut: 'alt.f',
  //     shortcutHint: 'f',
  //     children: [
  //       {
  //         routeLink: 'beds',
  //         icon: 'pi pi-plus-circle',
  //         shortcut: 'alt.b',
  //         shortcutHint: 'b',
  //         label: 'Beds',
  //         // permission: { resource: 'beds', action: 'view_all' },
  //       },
  //       {
  //         routeLink: 'departments',
  //         icon: 'pi pi-building',
  //         label: 'Departments',
  //         // permission: { resource: 'beds', action: 'view_all' },
  //       },
  //     ],
  //   },
  //   {
  //     icon: 'pi pi-cog',
  //     label: 'Settings',
  //     shortcut: 'alt.t',
  //     shortcutHint: 't',
  //     children: [
  //       {
  //         routeLink: 'settings',
  //         icon: 'pi pi-user',
  //         label: 'My Profile',
  //         shortcut: 'alt.p',
  //         shortcutHint: 'p',
  //       },
  //     ],
  //   },
  // ];

  private allItems: MasterSidebarItem[] = [
    // {
    //   routeLink: 'dashboard',
    //   icon: 'pi pi-home',
    //   label: 'Dashboard',
    //   shortcut: 'alt.d',
    //   shortcutHint: 'd',
    // },
    {
      id: '1',
      routeLink: '',
      icon: 'pi pi-users',
      label: 'UCO LIST',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '2',
      routeLink: '',
      icon: 'pi pi-plus-circle',
      label: 'Patients',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '3',
      routeLink: '',
      icon: 'pi pi-file-pdf',
      label: 'Report',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '4',
      routeLink: '',
      icon: 'pi pi-pencil',
      label: 'Edit',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '5',
      icon: 'pi pi-file',
      label: 'Files',
      shortcut: 'alt.f',
      shortcutHint: 'f',
      children: [
        {
          id: '5.1',
          routeLink: 'beds',
          icon: 'pi pi-plus-circle',
          shortcut: 'alt.b',
          shortcutHint: 'b',
          label: 'Beds/Wards',
          // permission: { resource: 'beds', action: 'view_all' },
        },
        // {
        //   id: '5.2',
        //   routeLink: '',
        //   icon: 'pi pi-building',
        //   label: 'Administration Schedules',
        //   // permission: { resource: 'beds', action: 'view_all' },
        // },
        {
          id: '5.3',
          routeLink: 'departments',
          shortcut: 'alt.d',
          icon: 'pi pi-building',
          label: 'Departments',
          // permission: { resource: 'beds', action: 'view_all' },
        },
      ],
    },
    {
      id: '6',
      routeLink: '',
      icon: 'pi pi-warehouse',
      label: 'Inventory',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '7',
      routeLink: '',
      icon: 'pi pi-question-circle',
      label: 'Help',
      // permission: { resource: 'patients', action: 'view' },
    },
    {
      id: '8',
      routeLink: '',
      icon: 'pi pi-list-check',
      label: 'Sign Verbal Orders',
      // permission: { resource: 'patients', action: 'view' },
    },
    // {
    //   id:'9',
    //   routeLink: '',
    //   icon: 'pi pi-check-circle',
    //   label: 'IV Final Check',
    //   // permission: { resource: 'patients', action: 'view' },
    // },
    // {
    //   icon: 'pi pi-cog',
    //   label: 'Settings',
    //   shortcut: 'alt.t',
    //   shortcutHint: 't',
    //   children: [
    //     {
    //       routeLink: 'settings',
    //       icon: 'pi pi-user',
    //       label: 'My Profile',
    //       shortcut: 'alt.p',
    //       shortcutHint: 'p',
    //     },
    //   ],
    // },
  ];

  // No changes needed below this line. The component logic is already perfect.

  items = computed(() => {
    // ... existing implementation ...
    const permittedItems: DisplaySidebarItem[] = [];
    const expanded = this.expandedMenus();
    const processItems = (items: MasterSidebarItem[], level: number): void => {
      for (const item of items) {
        const hasPermission =
          !item.permission ||
          this.authStore.hasPermission()(item.permission.resource, item.permission.action);
        if (!hasPermission) continue;
        const isParent = !!item.children?.length;
        const isExpanded = isParent && expanded.has(item.label);
        permittedItems.push({ ...item, level, isParent, expanded: isExpanded });
        if (isExpanded && item.children) {
          processItems(item.children, level + 1);
        }
      }
    };
    processItems(this.allItems, 0);
    return permittedItems;
  });

  handleItemClick(item: DisplaySidebarItem): void {
    if (item.isParent) {
      this.expandedMenus.update((current) => {
        const updated = new Set(current);
        updated.has(item.label) ? updated.delete(item.label) : updated.add(item.label);
        return updated;
      });
    } else if (item.routeLink && this.isLeftSidebarCollapsed()) {
      this.closeSidenav();
    }
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
