import { Directive, Input, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShortcutService } from '../services/shortcut.service';

@Directive({
  selector: '[shortcut]',
  standalone: true,
})
export class ShortcutDirective implements OnInit, OnDestroy {
  @Input('shortcut') key?: string;

  private shortcutService = inject(ShortcutService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private subscription?: Subscription;

  ngOnInit(): void {
    if (this.key) {
      // console.log(
      //   `%c[ShortcutDirective]%c Registering '${this.key}' on`,
      //   'color: #007bff; font-weight: bold;',
      //   'color: initial;',
      //   this.elementRef.nativeElement
      // );
      const element = this.elementRef.nativeElement;
      const tagName = element.tagName.toUpperCase();
      const focusableTags = ['INPUT', 'TEXTAREA', 'SELECT'];
      const action = focusableTags.includes(tagName) ? () => element.focus() : () => element.click();

      this.subscription = this.shortcutService.register({
        key: this.key,
        callback: action,
        element: element,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}