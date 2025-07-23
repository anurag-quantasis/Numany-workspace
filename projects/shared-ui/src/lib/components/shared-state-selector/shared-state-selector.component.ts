import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Imports - We now use DropdownModule
import { SelectModule } from 'primeng/select';

// Data Import (unchanged)
import { US_STATES } from '../../utils/constant';
import { State } from '../../utils/type';

@Component({
  selector: 'shared-state-selector',
  // **IMPORTANT**: Use DropdownModule now
  imports: [CommonModule, FormsModule, SelectModule],
  styleUrl: './shared-state-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedStateSelectorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="field flex flex-col gap-2">
      @if (label()) {
        <label class="font-semibold text-[#334155]">{{ label() }}</label>
      }

      <!-- Switched to p-dropdown with key properties -->
      <p-select
        [options]="allStates()"
        [ngModel]="selectedValue()"
        (ngModelChange)="selectedValue.set($event)"
        (onBlur)="onTouched()"
        [disabled]="isDisabled()"
        [placeholder]="placeholder()"
        [style]="{ width: '100%' }"
        inputStyleClass="p-inputtext p-component w-full"
        [editable]="true"
        [filter]="true"
        filterBy="name,code"
        optionLabel="name"
      >
        <ng-template pTemplate="item" let-state>
          <div>{{ state.name }} ({{ state.code }})</div>
        </ng-template>
      </p-select>
    </div>
  `,
})
export class SharedStateSelectorComponent implements ControlValueAccessor {
  // --- Inputs and Data Signals ---
  label = input<string>('State');
  placeholder = input<string>('Select or enter code');

  // We only need one signal for the states list now. No filtering logic needed here.
  protected allStates = signal<State[]>(US_STATES);
  protected selectedValue = signal<State | string | null>(null);
  protected isDisabled = signal<boolean>(false);

  // --- CVA Implementation ---
  private onChange: (value: string | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    // This effect logic remains the same and is still perfect.
    effect(() => {
      const value = this.selectedValue();
      // If the user selected an object from the list, emit its code.
      // If they typed a custom string, emit that string.
      const emitValue =
        typeof value === 'object' && value !== null
          ? (value as State).code
          : (value as string | null);

      this.onChange(emitValue);
    });
  }

  // Called by the parent form to set the value.
  writeValue(code: unknown): void {
    if (typeof code === 'string' && code) {
      const foundState = this.allStates().find((s) => s.code.toLowerCase() === code.toLowerCase());
      // If we find a matching state object, set it.
      // Otherwise, set the raw custom code string.
      this.selectedValue.set(foundState || code);
    } else {
      this.selectedValue.set(null);
    }
  }

  // These CVA methods remain the same.
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
