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
import { Fluid } from 'primeng/fluid';
import { CheckboxModule } from 'primeng/checkbox';

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
    Fluid,
    CheckboxModule,
  ],
  providers: [ValidationPipe], // Provide pipe to be injectable in the class
  template: `
    <div
      class="flex gap-2 w-full"
      [class.flex-col]="layout() === 'vertical'"
      [class.flex-row]="layout() === 'horizontal'"
      [class.items-center]="layout() === 'horizontal'"
      [class]="class()"
    >
      <!-- 
        Conditional rendering to control the ORDER of the label and the input.
        - By default (or for non-checkbox-first layouts), we render Label then Controls.
        - If it's a layout where the checkbox should come first, we reverse the order.
      -->
      <ng-container *ngIf="!isControlFirstLayout()">
        <ng-container *ngTemplateOutlet="labelTemplate"></ng-container>
        <ng-container *ngTemplateOutlet="controlsTemplate"></ng-container>
      </ng-container>

      <ng-container *ngIf="isControlFirstLayout()">
        <ng-container *ngTemplateOutlet="controlsTemplate"></ng-container>
        <ng-container *ngTemplateOutlet="labelTemplate"></ng-container>
      </ng-container>

      <!-- The error message is now outside the ordering logic, but inside the main container -->
      <div *ngIf="isInvalid()" class="h-4">
        <small class="text-red-500 whitespace-pre-line">
          {{ ngControl.control?.errors | validation: errorMessages() }}
        </small>
      </div>
    </div>

    <!-- 
      TEMPLATE DEFINITIONS 
      These are defined once and reused via ngTemplateOutlet above.
    -->

    <!-- The Label Template: Defined once, used where needed. -->
    <ng-template #labelTemplate>
      <label
        *ngIf="label()"
        [for]="id()"
        [class]="'font-semibold text-[#334155]' + labelClass()"
        [class.text-gray-400]="disabled"
        class="block"
      >
        {{ label() }}
        <span *ngIf="isRequired()" class="text-red-500 font-sans">*</span>
      </label>
    </ng-template>

    <!-- The Controls Template: Contains the logic for switching between actual input elements. -->
    <ng-template #controlsTemplate>
      <ng-container [ngSwitch]="type()">
        <!-- CHECKBOX -->
        <p-checkbox
          *ngSwitchCase="'checkbox'"
          [inputId]="id()"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (onBlur)="onBlur()"
          [disabled]="disabled"
          [binary]="binary()"
          [class.ng-invalid]="isInvalid()"
          [class.ng-dirty]="isInvalid()"
        />

        <!-- NUMBER -->
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
          [fluid]="fluid()"
        >
        </p-inputNumber>

        <!-- DEFAULT (text, email, password) -->
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
          [fluid]="fluid()"
        />
      </ng-container>
    </ng-template>
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
  type = input<'text' | 'number' | 'email' | 'password' | 'checkbox'>('text');
  errorMessages = input<{ [key: string]: string }>({});
  class = input<string>('');
  labelClass = input<string>('');
  id = input<string>(`custom-input-${nextId++}`);
  toastErrors = input<{ [key: string]: ToastErrorConfig }>({});
  useGrouping = input<boolean>(false);
  readonly = input<boolean>(false);
  fluid = input<boolean>(false);
  binary = input<boolean>(true);
  layout = input<'vertical' | 'horizontal'>('vertical');

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
  isControlFirstLayout = computed(
    () => this.type() === 'checkbox' && this.layout() === 'horizontal',
  );

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
