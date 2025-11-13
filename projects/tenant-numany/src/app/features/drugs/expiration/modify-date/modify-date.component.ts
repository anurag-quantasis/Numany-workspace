import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { CustomInputComponent } from 'shared-ui';

@Component({
  selector: 'tenant-modify-date',
  imports: [DatePicker, ReactiveFormsModule, CommonModule, Button, Checkbox, InputTextModule],
  templateUrl: './modify-date.component.html',
  styleUrl: './modify-date.component.css',
})
export class ModifyDateComponent implements OnInit {
  modifyDateGroup: FormGroup | undefined;

  ngOnInit(): void {
    this.modifyDateGroup = new FormGroup({
      drugId: new FormControl<string>(''),
      expirationDate: new FormControl(''),
      modifyDate: new FormControl<Date | null>(null),
      stockLevel: new FormControl(''),
    });
  }

  preventPopup(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
