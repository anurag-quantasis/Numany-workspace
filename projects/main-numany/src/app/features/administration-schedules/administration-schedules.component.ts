import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CustomInputComponent } from '../../../../../shared-ui/src/lib/components/form-components/custom-input/custom-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ScheduleSelectorComponent } from '../../shared/components/schedule-selector/schedule-selector.component';
import { ScheduleSelection } from '@main/shared/components/schedule-selector/schedule-selector.model';

@Component({
  selector: 'main-administration-schedules',
  standalone: true,
  templateUrl: './administration-schedules.component.html',
  styleUrl: './administration-schedules.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    ButtonModule,
    CustomInputComponent,
    ScheduleSelectorComponent,
  ],
})
export class AdministrationSchedulesComponent implements OnInit {
  form!: FormGroup;
  scheduleOptions = [
    { label: 'Time Interval Schedule', value: 'time interval' },
    { label: 'Fixed Time of Every Day', value: 'every day' },
    { label: 'Fixed Time of Specific Days', value: 'specific days' },
    { label: 'PRN Info Only', value: 'prn info' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      scheduleId: ['', Validators.required],
      selectedSchedule: ['', Validators.required],
      description: ['', Validators.required],
      dosesPerDay: ['', Validators.required],
      timeInterval: [null],
      adminTimes: [null],
      weekDays: [null],
    });
  }

  get scheduleId(){
    return this.form.get('scheduleId')
  }

  handleSchedule(schedule: ScheduleSelection, controlName: string) {
    this.form.get(controlName)?.setValue(schedule);
  }

  onSubmit() {
    console.log('Form Value:', this.form.value);
  }
}
