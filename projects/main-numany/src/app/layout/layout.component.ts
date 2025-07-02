import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/components/header/header.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../shared/components/sidebar/sidebar.component";
import { Subscription } from 'rxjs';
import { ShortcutService } from '../core/services/shortcut.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private readonly shortcutService = inject(ShortcutService);
  private shortcutSubscription?: Subscription;

  isLeftSidebarCollapsed = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  // ngOnInit(): void {
  //   // this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  // }

  ngOnInit(): void {
    this.shortcutSubscription = this.shortcutService.on('alt.shift.b', () => {
      let currentState = this.isLeftSidebarCollapsed();
      this.isLeftSidebarCollapsed.set(!currentState);
    });
  }

  ngAfterViewInit(): void {
    
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  screenClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return ''
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });

  // Clean up the subscription when the layout is destroyed (e.g., on logout).
  ngOnDestroy(): void {
    this.shortcutSubscription?.unsubscribe();
  }
}
