import { Directive, Input, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShortcutService } from '../services/shortcut.service';

@Directive({
  selector: '[shortcut]', // The attribute that activates this directive.
  standalone: true,
})
export class ShortcutDirective implements OnInit, OnDestroy {
  // The shortcut key. OPTIONAL. If omitted, the directive's only job is to create a context.
  @Input('shortcut') key?: string;

  private shortcutService = inject(ShortcutService);
  private elementRef = inject(ElementRef<HTMLElement>);

  // Internal state to track the role of this specific directive instance.
  private isContext = false;
  private contextId?: string;
  private subscription?: Subscription;

  ngOnInit(): void {
    // Logic to determine the directive's role based on whether a key was provided.
    if (this.key) {
      // ROLE 1: A leaf shortcut with a key. Registers itself with the active context.
      this.isContext = false;
      this.subscription = this.shortcutService.register({
        key: this.key,
        callback: () => this.elementRef.nativeElement.click(),
        element: this.elementRef.nativeElement, // Pass the element for better error reporting.
      });
    } else {
      // ROLE 2: A context provider. Pushes a new context onto the stack.

      console.error(
        `%c[ShortcutDirective] I am CREATING A NEW CONTEXT because of this element:`,
        'color: orange; font-size: 14px; font-weight: bold;',
      );
      console.log(this.elementRef.nativeElement);
      this.isContext = true;
      this.contextId = this.shortcutService.pushContext();
    }
  }

  // Cleans up by popping the context or unsubscribing from the specific shortcut.
  ngOnDestroy(): void {
    if (this.isContext) {
      if (this.contextId) {
        this.shortcutService.popContext(this.contextId);
      }
    } else {
      this.subscription?.unsubscribe();
    }
  }
}
