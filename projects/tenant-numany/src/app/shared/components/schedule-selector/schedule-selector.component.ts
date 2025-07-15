// projects/main-numany/src/app/shared/components/schedule-selector/schedule-selector.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class ScheduleSelectorComponent implements OnInit, OnChanges {
  @Input() showDurationInputs = true;
  @Input() showTimeSlots = true;
  @Input() showWeekDays = true;

  // FIX 1: Add an Input to receive data from the parent
  @Input() initialValue: any;

  @Output() scheduleChange = new EventEmitter<ScheduleSelection>();

  form!: FormGroup;
  // FIX 2: Use a consistent weekday order that matches the parent
  readonly weekDaysData = [
    { key: 'sun', label: 'SUN' },
    { key: 'mon', label: 'MON' },
    { key: 'tue', label: 'TUE' },
    { key: 'wed', label: 'WED' },
    { key: 'thu', label: 'THU' },
    { key: 'fri', label: 'FRI' },
    { key: 'sat', label: 'SAT' },
  ];
  timeSlotsData: { label: string }[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.generateTimeSlots();

    this.form = this.fb.group({
      duration: this.fb.group({
        // FIX 3: Use names that match the parent's `timeInterval` object
        int_day: [0],
        int_val: [0],
        minutes: [0],
      }),
      timeSlots: this.fb.array(this.timeSlotsData.map(() => this.fb.control(false))),
      weekDays: this.fb.array(this.weekDaysData.map(() => this.fb.control(false))),
    });

    this.form.valueChanges.subscribe(() => this.emitSchedule());

    // Apply initial value if it was passed during initialization
    if (this.initialValue) {
      this.patchForm(this.initialValue);
    }
  }

  // FIX 4: Implement OnChanges to react to parent form updates
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && this.form) {
      this.patchForm(changes['initialValue'].currentValue);
    }
  }

  private patchForm(value: any) {
    if (!value) return;

    const patchData: any = {};

    // Patch duration/interval if this instance shows it
    if (this.showDurationInputs && value.int_val !== undefined) {
      patchData.duration = {
        int_day: value.int_day || 0,
        int_val: value.int_val || 0,
        minutes: value.minutes || 0,
      };
    }

    // Patch time slots if this instance shows them
    if (this.showTimeSlots && Array.isArray(value)) {
      const timeSlotValues = this.timeSlotsData.map((slot) => value.includes(slot.label));
      patchData.timeSlots = timeSlotValues;
    }

    // Patch weekdays if this instance shows them
    if (this.showWeekDays && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const weekDayValues = this.weekDaysData.map((day) => !!value[day.key]);
      patchData.weekDays = weekDayValues;
    }

    // Use emitEvent: false to prevent an infinite loop of change events
    this.form.patchValue(patchData, { emitEvent: false });
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
      // FIX 5: Emit the data in the format the parent expects
      result.timeInterval = this.form.get('duration')!.value;
    }

    if (this.showTimeSlots) {
      result.adminTimes = this.timeSlots.controls
        .map((ctrl, index) => (ctrl.value ? this.timeSlotsData[index].label : null))
        .filter(Boolean) as string[];
    }

    if (this.showWeekDays) {
      // FIX 6: Emit the data in the object format the parent expects
      const weekDayObj: { [key: string]: boolean } = {};
      this.weekDays.controls.forEach((ctrl, index) => {
        const dayKey = this.weekDaysData[index].key;
        weekDayObj[dayKey] = !!ctrl.value;
      });
      result.weekDays = weekDayObj;
    }

    this.scheduleChange.emit(result);
  }
}
