import { CommonModule } from '@angular/common';
import { Component, Self, computed, effect, inject, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationPipe } from '../../pipes/validation.pipe';

// PrimeNG Imports
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

// Type definition for cleaner, declarative toast configuration.
export type ToastErrorConfig = {
  severity: 'error' | 'warn' | 'info' | 'success';
  summary: string;
};

// Counter for generating unique IDs for accessibility.
let nextId = 0;

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Required for ngModel
    ReactiveFormsModule,
    ValidationPipe,
    InputTextModule,
    InputNumberModule,
  ],
  providers: [ValidationPipe], // Provide pipe to be injectable in the class
  template: `
    <div class="flex flex-col gap-1 w-full" [class]="class()">
      <label *ngIf="label()" [for]="id()" [class]="'font-semibold' + labelClass()">
        {{ label() }}
        <span *ngIf="isRequired()" class="text-red-500 font-sans">*</span>
      </label>

      <ng-container [ngSwitch]="type()">
        <p-inputNumber
          *ngSwitchCase="'number'"
          [inputId]="id()"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (onBlur)="onBlur()"
          [useGrouping]="useGrouping()"
          [disabled]="disabled"
          [placeholder]="placeholder()"
          styleClass="w-full"
          [class.ng-invalid]="isInvalid()"
          [class.ng-dirty]="isInvalid()"
          [readonly]="readonly()"
        >
        </p-inputNumber>

        <input
          *ngSwitchDefault
          pInputText
          [id]="id()"
          [type]="type()"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onBlur()"
          [disabled]="disabled"
          [placeholder]="placeholder()"
          class="w-full p-2"
          [class.ng-invalid]="isInvalid()"
          [class.ng-dirty]="isInvalid()"
          [readonly]="readonly()"
        />
      </ng-container>

      <div *ngIf="isInvalid()" class="h-4">
        <small class="text-red-500 whitespace-pre-line">
          {{ ngControl.control?.errors | validation: errorMessages() }}
        </small>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  // --- Modern Signal-Based Inputs ---
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'number' | 'email' | 'password'>('text');
  errorMessages = input<{ [key: string]: string }>({});
  class = input<string>('');
  labelClass = input<string>('');
  id = input<string>(`custom-input-${nextId++}`);
  toastErrors = input<{ [key: string]: ToastErrorConfig }>({});
  useGrouping = input<boolean>(false);
  readonly = input<boolean>(false); // <-- CHANGED: Now a signal input, and named `readonly`

  // --- Injections ---
  public ngControl: NgControl = inject(NgControl, { self: true });
  private messageService = inject(MessageService);
  private validationPipe = inject(ValidationPipe);

  // --- Writable Signal for State Tracking ---
  // This signal acts as a trigger for our computed signals.
  private controlStatus = signal<string | null>(null);

  // --- CVA Properties ---
  protected value: any = '';
  protected disabled = false; // This is for CVA's setDisabledState
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.ngControl.valueAccessor = this;

    // Bridge the form control's RxJS statusChanges to our internal signal.
    // `takeUntilDestroyed` automatically handles unsubscribing when the component is destroyed.
    if (this.ngControl.control) {
      this.ngControl.control.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
        // Every time the form control's status changes (e.g., from markAllAsTouched),
        // we update our signal, which triggers our computed signals to re-evaluate.
        this.controlStatus.set(status);
      });
    }

    // Effect for triggering toast notifications.
    effect(() => {
      const control = this.ngControl.control;
      const toastConfigs = this.toastErrors();

      // We use isInvalid() here because it's a computed signal that depends on our trigger.
      if (this.isInvalid() && control?.errors) {
        const errorKey = Object.keys(control.errors).find((key) => toastConfigs[key]);
        if (errorKey) {
          const config = toastConfigs[errorKey];
          this.messageService.add({
            key: 'custom-toast',
            severity: config.severity,
            summary: config.summary,
            detail: this.validationPipe.transform(control.errors, this.errorMessages()),
            life: 3000,
          });
        }
      }
    });
  }

  // --- Reactive State Checks using TRUE Computed Signals ---
  // These will automatically re-evaluate when `controlStatus` changes.
  isInvalid = computed(() => {
    this.controlStatus(); // Create a dependency on our trigger signal.
    const c = this.ngControl.control;
    return !!(c && c.invalid && (c.touched || c.dirty));
  });

  isRequired = computed(() => {
    this.controlStatus(); // Also create a dependency here.
    const c = this.ngControl.control;
    // Check if the control has a 'required' validator
    if (c?.validator) {
      const validatorResult = c.validator(new FormControl());
      return validatorResult && validatorResult['required'];
    }
    return false;
  });

  // --- ControlValueAccessor Implementation ---
  writeValue = (v: any): void => {
    this.value = v;
  };
  registerOnChange = (fn: any): void => {
    this.onChange = fn;
  };
  registerOnTouched = (fn: any): void => {
    this.onTouched = fn;
  };
  setDisabledState = (isDisabled: boolean): void => {
    this.disabled = isDisabled;
  };

  // --- Component Event Handlers ---
  onBlur = (): void => {
    this.onTouched();
    // Manually update the signal on blur for the most immediate feedback,
    // as the statusChanges observable might have a microtask delay.
    this.controlStatus.set(this.ngControl.control?.status ?? null);
  };
}
