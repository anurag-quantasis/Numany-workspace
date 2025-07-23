import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'flex gap-1 flex-col ' + class">
      <label *ngIf="label" class="text-active font-steviesans" [for]="id" [class]="labelClass"
        >{{ label }}
        <small
          *ngIf="isRequired"
          style="vertical-align: text-bottom;
    font-family: auto"
          class="text-red-500 "
          >*</small
        >
      </label>
      <ng-content></ng-content>
    </div>
    <div *ngIf="formObj?.invalid && formObj?.touched">
      <ng-container *ngFor="let errorType of errorKeys">
        <small
          *ngIf="formObj?.errors?.[errorType]"
          style="white-space:pre-line"
          class=" text-nowrap text-red-500"
          >{{ errorMessages[errorType] }}</small
        >
      </ng-container>
    </div>
  `,
  styles: ``,
})
export class InputGroupComponent {
  @Input({ required: false }) label: string = '';
  @Input({ required: true }) id: string = '';
  @Input() formObj: FormControl = new FormControl();
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() labelClass: string = '';
  @Input() errorMessageClass: string = '';
  @Input() class: string = '';
  @Input({ required: false }) isRequired = false;

  get errorKeys() {
    return Object.keys(this.errorMessages);
  }
}
