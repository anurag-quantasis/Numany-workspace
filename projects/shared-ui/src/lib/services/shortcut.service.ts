import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ShortcutRegisterOptions {
  key: string;
  callback: (event: KeyboardEvent) => void;
  element?: HTMLElement;
}

// Helper for logging to make output clear
const log = (group: string, message: string, ...data: any[]) => {
  // console.log(`%c[${group}]%c ${message}`, 'color: #888; font-weight: bold;', 'color: initial;', ...data);
};

@Injectable({
  providedIn: 'root',
})
export class ShortcutService implements OnDestroy {
  private shortcutTree: Map<string, any> = new Map();
  private currentPath: Map<string, any> = this.shortcutTree;
  private sequenceTimeout: any;
  private readonly TIMEOUT_MS = 5000;

  private keyboardSubscription: Subscription;

  constructor() {
    log('ShortcutService', 'Service Initialized.');
    this.keyboardSubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        tap((event) => {
          this.handleKeyDown(event);
        }),
      )
      .subscribe();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    clearTimeout(this.sequenceTimeout);
    const key = this.normalizeKey(event);
    if (!key) return;

    log('Keydown', `Key pressed: '${key}'`);
    log('Keydown', `Current Path Keys: [${Array.from(this.currentPath.keys()).join(', ')}]`);

    const nextNode = this.currentPath.get(key);

    if (nextNode) {
      log('Keydown', `✅ Found node for '${key}' in CURRENT path.`);

      // --- FIX: Only prevent default for shortcuts with modifiers ---
      if (key.includes('.')) {
        log('Keydown', `Modifier key detected. Calling event.preventDefault().`);
        event.preventDefault();
      }

      if (nextNode.action) {
        log('Keydown', `▶️ EXECUTING ACTION for '${key}'`);
        nextNode.action(event);
      }

      if (nextNode.children && nextNode.children.size > 0) {
        log('Keydown', `➡️ Descending into new path...`);
        this.currentPath = nextNode.children;
        this.sequenceTimeout = setTimeout(() => this.resetPath(), this.TIMEOUT_MS);
      } else {
        log('Keydown', `🏁 Leaf node reached. Resetting path.`);
        this.resetPath();
      }
    } else {
      log('Keydown', `❌ Key '${key}' not found in current path. Resetting and trying from root.`);
      this.resetPath();
      const rootNode = this.shortcutTree.get(key);

      if (rootNode) {
        log('Keydown', `✅ Found node for '${key}' in ROOT path.`);

        // --- FIX: Apply the same logic here for root-level shortcuts ---
        if (key.includes('.')) {
          log('Keydown', `Modifier key detected. Calling event.preventDefault().`);
          event.preventDefault();
        }

        if (rootNode.action) {
          log('Keydown', `▶️ EXECUTING ACTION for '${key}'`);
          rootNode.action(event);
        }
        if (rootNode.children && rootNode.children.size > 0) {
          log('Keydown', `➡️ Descending into new path...`);
          this.currentPath = rootNode.children;
          this.sequenceTimeout = setTimeout(() => this.resetPath(), this.TIMEOUT_MS);
        }
      } else {
        log('Keydown', `❌ Key '${key}' not found anywhere. Ignoring.`);
      }
    }
  }

  private resetPath(): void {
    if (this.currentPath !== this.shortcutTree) {
      log('State', 'Path reset to root.');
    }
    this.currentPath = this.shortcutTree;
    clearTimeout(this.sequenceTimeout);
  }

  register(options: ShortcutRegisterOptions): Subscription {
    log('Register', `Registering chain: '${options.key}'`);
    const keys = options.key.split(' '); // Split sequences by space
    let currentLevel = this.shortcutTree;

    keys.forEach((key, index) => {
      if (!currentLevel.has(key)) {
        currentLevel.set(key, { children: new Map() });
      }
      if (index === keys.length - 1) {
        currentLevel.get(key).action = options.callback;
      }
      currentLevel = currentLevel.get(key).children;
    });

    return new Subscription(() => {
      this.unregister(options.key);
    });
  }

  private unregister(keyChain: string): void {
    log('Register', `Unregistering chain: '${keyChain}'`);
    const keys = keyChain.split(' ');
    let currentLevel = this.shortcutTree;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!currentLevel.has(key)) return;
      if (i === keys.length - 1) {
        const node = currentLevel.get(key);
        if (node) {
          delete node.action;
        }
      } else {
        currentLevel = currentLevel.get(key).children;
      }
    }
  }

  private normalizeKey(event: KeyboardEvent): string | null {
    const modifiers: string[] = [];
    if (event.altKey) modifiers.push('alt');
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const mainKey = event.key.toLowerCase();

    // Case 1: Modifiers are present.
    if (modifiers.length > 0) {
      // Ignore modifier-only presses (e.g., just pressing Alt).
      if (['alt', 'control', 'shift', 'meta'].includes(mainKey)) return null;
      return [...modifiers.sort(), mainKey].join('.');
    }

    // Case 2: No modifiers are present (the key is part of a sequence).
    // This is the updated, more permissive logic.
    const isAlphanumeric = mainKey.length === 1 && mainKey.match(/[a-z0-9]/i);
    const isFunctionKey =
      mainKey.startsWith('f') && mainKey.length > 1 && !isNaN(Number(mainKey.substring(1)));
    const allowedSpecialKeys = [
      'enter',
      'escape',
      'tab',
      'arrowup',
      'arrowdown',
      'arrowleft',
      'arrowright',
    ];

    if (isAlphanumeric || isFunctionKey || allowedSpecialKeys.includes(mainKey)) {
      return mainKey;
    }

    // If none of the above, it's not a key we want to track in a sequence.
    return null;
  }

  on(key: string, callback: (event: KeyboardEvent) => void): Subscription {
    return this.register({ key, callback });
  }

  ngOnDestroy(): void {
    log('ShortcutService', 'Service Destroyed.');
    this.keyboardSubscription.unsubscribe();
    this.resetPath();
    this.shortcutTree.clear();
  }
}
