import { Directive, Input, ElementRef, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[shortcutKeyHint]', // The attribute that activates this directive.
  standalone: true,
})
export class ShortcutKeyHintDirective implements OnChanges {
  // The character in the element's text that should be underlined.
  @Input({ required: true, alias: 'shortcutKeyHint' }) keyHint!: string;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  // Updates the underline whenever the input text changes.
  ngOnChanges(): void {
    // set time out applied because of if and for conditions not working due to angular lifecycle
    setTimeout(() => {
      if (this.keyHint) {
        this.applyHint();
      } else {
        // If the hint is removed, restore the original text.
        this.clearHint();
      }
    }, 0);
  }

  // Finds the first instance of the hint letter and wraps it in a <u> tag.
  private applyHint(): void {
    const originalText = this.el.nativeElement.textContent || '';
    const hintLetter = this.keyHint.toLowerCase();
    const index = originalText.toLowerCase().indexOf(hintLetter);

    if (index !== -1) {
      const newHtml =
        originalText.substring(0, index) +
        `<u>${originalText.substring(index, index + 1)}</u>` +
        originalText.substring(index + 1);
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', newHtml);
    }
  }

  // A helper function to remove any existing underlines.
  private clearHint(): void {
    const originalText = this.el.nativeElement.textContent || '';
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', ''); // Clear first
    this.renderer.appendChild(this.el.nativeElement, this.renderer.createText(originalText));
  }
}
