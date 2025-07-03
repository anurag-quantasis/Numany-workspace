import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

// A layer in our stack. Each context holds its own set of shortcuts.
type ShortcutContext = {
  id: string;
  shortcuts: Map<string, Subject<KeyboardEvent>>;
};

// Options for registering a shortcut, used for clear and extensible API.
export interface ShortcutRegisterOptions {
  key: string;
  callback: (event: KeyboardEvent) => void;
  element?: HTMLElement; // Optional: Used for enhanced error reporting.
}

@Injectable({
  providedIn: 'root', // A single instance for the entire application.
})
export class ShortcutService implements OnDestroy {
  // The stack that manages shortcut priority. The last context is the most active.
  private contextStack: ShortcutContext[] = [];
  // A single global listener on the document for performance.
  private keyboardSubscription: Subscription;
  private contextIdCounter = 0;

  constructor() {
    this.keyboardSubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        tap((event) => {
          // Always check only the topmost (most active) context.
          const activeContext = this.contextStack[this.contextStack.length - 1];
          if (!activeContext) return;

          const key = this.normalizeKey(event); // This will now log to the console
          if (activeContext.shortcuts.has(key)) {
            event.preventDefault(); // Stop browser default actions (e.g., Alt+F).
            activeContext.shortcuts.get(key)!.next(event); // Trigger the shortcut.
          }
        }),
      )
      .subscribe();
  }

  /** Pushes a new context onto the stack, making its shortcuts highest priority. */
  pushContext(): string {
    const newContextId = `context-${this.contextIdCounter++}`;
    this.contextStack.push({
      id: newContextId,
      shortcuts: new Map(),
    });
    return newContextId;
  }

  /** Pops a context off the stack, cleaning it up and restoring priority to the one below. */
  popContext(id: string): void {
    const contextIndex = this.contextStack.findIndex((c) => c.id === id);
    if (contextIndex > -1) {
      this.contextStack[contextIndex].shortcuts.forEach((subject) => subject.complete());
      this.contextStack.splice(contextIndex, 1);
    }
  }

  /** Registers a shortcut to the currently active (topmost) context. */
  register(options: ShortcutRegisterOptions): Subscription {
    const { key, callback, element } = options;
    const normalizedKey = key.toLowerCase();
    const activeContext = this.contextStack[this.contextStack.length - 1];

    if (!activeContext) {
      let errorMessage = `Cannot register shortcut '${key}'. No active shortcut context was found.`;
      errorMessage += `\n\n[Fix]: Ensure a parent element is marked with the 'shortcut' attribute to create a context.`;
      if (element) {
        const elementTag = element.tagName.toLowerCase();
        const elementId = element.id ? `#${element.id}` : '';
        const elementClasses =
          element.classList.length > 0 ? `.${Array.from(element.classList).join('.')}` : '';
        errorMessage += `\n\n[Source]: The error originated from the element: <${elementTag}${elementId}${elementClasses}>`;
      }
      throw new Error(errorMessage);
    }

    if (!activeContext.shortcuts.has(normalizedKey)) {
      activeContext.shortcuts.set(normalizedKey, new Subject<KeyboardEvent>());
    }

    const subject = activeContext.shortcuts.get(normalizedKey)!;
    return subject.subscribe(callback);
  }

  /** Imperative API for registering non-DOM shortcuts. Just an alias for `register`. */
  on(key: string, callback: (event: KeyboardEvent) => void): Subscription {
    return this.register({ key, callback });
  }

  /**
   * Ensures a consistent and predictable key string format.
   * Modifiers are sorted and placed before the main key.
   */
  private normalizeKey(event: KeyboardEvent): string {
    const modifiers: string[] = [];
    if (event.altKey) modifiers.push('alt');
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const mainKey = event.key.toLowerCase();

    let result: string;
    if (!['alt', 'control', 'shift', 'meta'].includes(mainKey)) {
      result = [...modifiers.sort(), mainKey].join('.');
    } else {
      result = modifiers.sort().join('.');
    }

    // --- ADDED FOR DEBUGGING ---
    // This will log the raw key and the final normalized string to the console.
    // console.log(
    //   `%c[ShortcutService] normalizeKey | Raw key: '${event.key}' -> Normalized: '%c${result}'`,
    //   'color: #999; font-weight: bold;', // Style for the static text
    //   'color: #007bff; font-weight: bold; text-decoration: underline;' // Style for the dynamic result
    // );
    // --- END DEBUGGING CODE ---

    return result;
  }

  /** Cleans up all subscriptions and contexts when the service is destroyed. */
  ngOnDestroy(): void {
    this.keyboardSubscription.unsubscribe();
    this.contextStack.forEach((context) => {
      context.shortcuts.forEach((subject) => subject.complete());
    });
  }
}
