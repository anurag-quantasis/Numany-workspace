import { inject, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private dialogService = inject(DialogService);

  open<T>(
    component: Type<T>,
    headerText: string,
    config: Partial<DynamicDialogConfig> = {},
  ): DynamicDialogRef {
    const defaultConfig: DynamicDialogConfig = {
      header: headerText,
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closeOnEscape: true,
      closable: true,
      dismissableMask: true,
      focusTrap: true,
      modal: true,
    };

    const mergedConfig = { ...defaultConfig, ...config };

    const dialogRef = this.dialogService.open(component, mergedConfig);
    return dialogRef;
  }
}
