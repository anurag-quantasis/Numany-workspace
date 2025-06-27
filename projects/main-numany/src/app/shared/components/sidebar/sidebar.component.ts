import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AuthStore } from '../../../core/auth/auth-store/auth.store';
import { PermissionRequirement } from '../../../core/auth/permissions/role';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

type MasterSidebarItem = {
  routeLink?: string;
  icon: string;
  label: string;
  permission?: PermissionRequirement;
  children?: MasterSidebarItem[];
};

// Flattened display type for template use
type DisplaySidebarItem = MasterSidebarItem & {
  level: number;
  isParent: boolean;
  expanded?: boolean;
};

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly authStore = inject(AuthStore);
  
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  private expandedMenus = signal<Set<string>>(new Set());

  // Master Item Contains all labels
  private allItems: MasterSidebarItem[] = [
    {
      routeLink: '',
      icon: 'pi pi-home',
      label: 'Dashboard',
    },
    {
      routeLink: 'patients',
      icon: 'pi pi-users',
      label: 'Patients',
      permission: { resource: 'patients', action: 'view' },
    },
    {
      routeLink: 'beds',
      icon: 'pi pi-box',
      label: 'Bed Management',
      permission: { resource: 'beds', action: 'view_all' },
    },
    {
      icon: 'pi pi-server',
      label: 'System',
      children: [
        {
          routeLink: 'system/tenants',
          icon: 'pi pi-building',
          label: 'Manage Tenants',
          permission: { resource: 'tenants', action: 'view_all' },
        },
      ],
    },
    {
      icon: 'pi pi-cog',
      label: 'Settings',
      children: [
        {
          routeLink: 'settings',
          icon: 'pi pi-user',
          label: 'My Profile',
        },
        {
          routeLink: 'settings/users',
          icon: 'pi pi-id-card',
          label: 'User Management',
          permission: { resource: 'tenant_users', action: 'view_all' },
        },
      ],
    },
  ];

  // Flattened and filtered list for rendering
  items = computed(() => {
    const permittedItems: DisplaySidebarItem[] = [];
    const expanded = this.expandedMenus();

    const processItems = (
      items: MasterSidebarItem[],
      level: number
    ): void => {
      for (const item of items) {
        const hasPermission =
          !item.permission ||
          this.authStore.hasPermission()(
            item.permission.resource,
            item.permission.action
          );

        if (!hasPermission) continue;

        const isParent = !!item.children?.length;
        const isExpanded = isParent && expanded.has(item.label);

        permittedItems.push({
          ...item,
          level,
          isParent,
          expanded: isExpanded,
        });

        if (isExpanded && item.children) {
          processItems(item.children, level + 1);
        }
      }
    };

    processItems(this.allItems, 0);
    return permittedItems;
  });

  // Handle clicks for navigation or toggling submenus
  handleItemClick(item: DisplaySidebarItem): void {
    if (item.isParent) {
      this.expandedMenus.update((current) => {
        const updated = new Set(current);
        updated.has(item.label)
          ? updated.delete(item.label)
          : updated.add(item.label);
        return updated;
      });
    } else if (item.routeLink && this.isLeftSidebarCollapsed()) {
      this.closeSidenav();
    }
  }

  // Collapse/Expand sidebar
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  // Close sidebar entirely
  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
