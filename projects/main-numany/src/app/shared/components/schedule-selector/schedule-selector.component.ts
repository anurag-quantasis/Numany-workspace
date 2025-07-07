import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

import { ScheduleSelection } from './schedule-selector.model';

@Component({
  selector: 'main-schedule-selector',
  standalone: true,
  imports: [CommonModule, CheckboxModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './schedule-selector.component.html',
  styleUrls: ['./schedule-selector.component.css'],
})
export class ScheduleSelectorComponent implements OnInit {
  @Input() showDurationInputs = true;
  @Input() showTimeSlots = true;
  @Input() showWeekDays = true;

  @Output() scheduleChange = new EventEmitter<ScheduleSelection>();

  form!: FormGroup;
  timeSlotsData: { label: string }[] = [];
  weekDaysData = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.generateTimeSlots();

    this.form = this.fb.group({
      duration: this.fb.group({
        days: [0],
        hours: [0],
        minutes: [0],
      }),
      timeSlots: this.fb.array(this.timeSlotsData.map(() => this.fb.control(false))),
      weekDays: this.fb.array(this.weekDaysData.map(() => this.fb.control(false))),
    });

    this.form.valueChanges.subscribe(() => this.emitSchedule());
  }

  get timeSlots(): FormArray {
    return this.form.get('timeSlots') as FormArray;
  }

  get weekDays(): FormArray {
    return this.form.get('weekDays') as FormArray;
  }

  private generateTimeSlots() {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        this.timeSlotsData.push({
          label: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
        });
      }
    }
  }

  emitSchedule() {
    const result: ScheduleSelection = {};

    if (this.showDurationInputs) {
      const { days, hours, minutes } = this.form.get('duration')!.value;
      result.duration = { days, hours, minutes };
    }

    if (this.showTimeSlots) {
      result.selectedTimes = this.timeSlots.controls
        .map((ctrl, index) => (ctrl.value ? this.timeSlotsData[index].label : null))
        .filter(Boolean) as string[];
    }

    if (this.showWeekDays) {
      result.selectedWeekDays = this.weekDays.controls
        .map((ctrl, index) => (ctrl.value ? this.weekDaysData[index] : null))
        .filter(Boolean) as string[];
    }

    this.scheduleChange.emit(result);
  }
}
