// src/app/shared-ui/form-components/custom-input/custom-input.component.ts

import { Component, Input, forwardRef, OnInit, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'shared-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, KeyFilterModule],
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() pKeyFilter: any = null;
  @Input() inputStyle: any = null;
  @Input() inputStyleClass: string = '';

  value: any = '';
  isDisabled: boolean = false;
  control: NgControl | null = null;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.control = this.injector.get(NgControl, null);
  }
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  onInputBlur() {
    this.onTouched();
  }

  // public get showError(): boolean {
  //   if (!this.control?.control) {
  //     return false;
  //   }
  //   const { invalid, touched } = this.control.control;
  //   return invalid && touched;
  // }
}
