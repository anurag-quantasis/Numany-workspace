import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'tenant-toaster',
  imports: [ToastModule, CommonModule],
  templateUrl: './toaster.component.html',
  styles: ``,
})
export class ToasterComponent {
  private readonly messageService = inject(MessageService);
  close() {
    this.messageService.clear('custom-toast');
  }

  getToastBaseColorClass(severity: string): string {
    const base = '400'; // your base tone
    const colorMap: Record<string, string> = {
      success: `bg-success-${base}`,
      error: `bg-error-${base}`,
      warn: `bg-warning-${base}`,
      info: `bg-secondary-${base}`,
    };

    return colorMap[severity] || `bg-color-grey-${base}`;
  }
}
