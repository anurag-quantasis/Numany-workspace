import { Component, OnInit, inject, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG & Custom Modules
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AdministrationScheduleStore } from './administration-schedules-store/administration-schedules.store';
import {
  NewSchedulePayload,
  Schedule,
} from './administration-schedules-store/administration-schedules.model';
import { CustomInputComponent, SharedPanelContainerComponent } from 'shared-ui';
import { ScheduleSelectorComponent } from '../../shared/components/schedule-selector/schedule-selector.component';

interface WeekdaySelection {
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
}

@Component({
  selector: 'tenant-schedule-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    RadioButtonModule,
    ButtonModule,
    InputTextModule,
    ScheduleSelectorComponent,
    CustomInputComponent,
    SharedPanelContainerComponent,
  ],
  templateUrl: './administration-schedules.component.html',
  providers: [AdministrationScheduleStore],
})
export class AdministrationSchedulesComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly store = inject(AdministrationScheduleStore);

  readonly isNewMode = signal(false);
  form: FormGroup;

  readonly scheduleOptions = computed(() =>
    this.store.schedules().map((s) => ({
      name: `${s.idesc} (${s.id_sced})`,
      value: s.id_sced,
    })),
  );

  private readonly weekdayOrder: (keyof WeekdaySelection)[] = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
  ];

  constructor() {
    this.form = this.fb.group({
      selectedId: [null],
      newScheduleId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.-]*$/)]],
      selectedSchedule: ['time interval', Validators.required],
      description: ['', Validators.required],
      dosesPerDay: [0, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(0)]],
      // Child component data holders
      timeInterval: [{ int_val: 0, int_day: 0, minutes: 0 }],
      adminTimes: [[]],
      weekDays: [null],
    });

    effect(() => {
      const selected = this.store.selectedSchedule();

      this.form.reset({
        selectedSchedule: 'time interval',
        dosesPerDay: 0,
        timeInterval: { int_val: 0, int_day: 0, minutes: 0 },
        adminTimes: [],
        weekDays: {
          sun: false,
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
        },
      });

      if (this.isNewMode()) {
        this.form.get('selectedId')?.disable();
        this.form.get('newScheduleId')?.enable();
        this.form.get('description')?.setValue('New Schedule');
      } else if (selected) {
        this.form.get('selectedId')?.enable();
        this.form.get('newScheduleId')?.disable();

        this.form.patchValue(this.mapApiToForm(selected));
        const parsedInterval = this.parseHHMM(selected.int_val);

        this.form.patchValue({
          timeInterval: {
            int_day: selected.int_day,
            int_val: parsedInterval.hours, // int_val on the form is hours
            minutes: parsedInterval.minutes,
          },
          weekDays: this.transformBinaryStringToWeekdays(selected.if_day),
          adminTimes: this.transformBinaryStringToAdminTimes(selected.if_time),
        });
      } else {
        this.form.get('selectedId')?.enable();
        this.form.get('newScheduleId')?.disable();
      }
    });
  }

  ngOnInit() {
    this.store.loadSchedules();
  }

  private parseHHMM(hhmm: number): { hours: number; minutes: number } {
    // FIX: Handle null/undefined case
    if (hhmm == null) return { hours: 0, minutes: 0 };
    const hhmmStr = hhmm.toString().padStart(4, '0');
    const hours = parseInt(hhmmStr.substring(0, 2), 10);
    const minutes = parseInt(hhmmStr.substring(2, 4), 10);
    return { hours, minutes };
  }

  // --- Data Mapping Functions (API -> Form) ---
  private mapApiToForm(schedule: Schedule): object {
    let scheduleType = 'prn info'; // Default
    switch (schedule.ifixed) {
      case 0:
        scheduleType = 'time interval';
        break;
      case 1:
        scheduleType = 'every day';
        break;
      case 2:
        scheduleType = 'specific days';
        break;
      case -1:
        scheduleType = 'prn info';
        break;
    }

    return {
      selectedId: schedule.id_sced,
      description: schedule.idesc,
      selectedSchedule: scheduleType,
      dosesPerDay: schedule.nday,
    };
  }

  private transformBinaryStringToWeekdays(binaryString: string = '0000000'): WeekdaySelection {
    const selections: Partial<WeekdaySelection> = {};
    this.weekdayOrder.forEach((day, index) => {
      selections[day] = binaryString.charAt(index) === '1';
    });
    return selections as WeekdaySelection;
  }

  private transformBinaryStringToAdminTimes(binaryString: string = ''): string[] {
    const times: string[] = [];
    if (binaryString.length !== 48) return [];

    for (let i = 0; i < 48; i++) {
      if (binaryString.charAt(i) === '1') {
        const hour = Math.floor(i / 2)
          .toString()
          .padStart(2, '0');
        const minute = i % 2 === 0 ? '00' : '30';
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }

  // --- Data Mapping Functions (Form -> API) ---
  private mapFormToApi(): NewSchedulePayload {
    const formValue = this.form.getRawValue();

    let ifixedValue = -1; // Default to 'prn info'
    switch (formValue.selectedSchedule) {
      case 'time interval':
        ifixedValue = 0;
        break;
      case 'every day':
        ifixedValue = 1;
        break;
      case 'specific days':
        ifixedValue = 2;
        break;
    }

    const hours = Number(formValue.timeInterval?.int_val || 0);
    const minutes = Number(formValue.timeInterval?.minutes || 0);
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const intValHHMM = Number(`${hh}${mm}`);

    const payload: NewSchedulePayload = {
      id_sced: this.isNewMode() ? formValue.newScheduleId : formValue.selectedId,
      idesc: formValue.description,
      ifixed: ifixedValue,
      nday: Number(formValue.dosesPerDay) || 0,
      int_val: intValHHMM,
      int_day: Number(formValue.timeInterval?.int_day || 0),
      if_day: this.transformWeekdaysToBinaryString(formValue.weekDays),
      if_time: this.transformAdminTimesToBinaryString(formValue.adminTimes),
      hide_list: false,
    };

    return payload;
  }

  private transformWeekdaysToBinaryString(weekdays: Partial<WeekdaySelection> | null): string {
    if (!weekdays) return '0'.repeat(7);
    return this.weekdayOrder.map((day) => (weekdays[day] ? '1' : '0')).join('');
  }

  private transformAdminTimesToBinaryString(times: string[] | null): string {
    if (!Array.isArray(times) || times.length === 0) {
      return '0'.repeat(48);
    }
    const binaryArray = Array(48).fill('0');
    times.forEach((time) => {
      const [hour, minute] = time.split(':').map(Number);
      const index = hour * 2 + (minute === 30 ? 1 : 0);
      if (index >= 0 && index < 48) {
        binaryArray[index] = '1';
      }
    });
    return binaryArray.join('');
  }

  // --- Event Handlers ---
  handleSchedule(event: any) {
    // This handler receives emissions from child components and patches the form.
    // If child components are well-behaved, a simple patch is sufficient.
    this.form.patchValue(event);
  }

  onScheduleSelected(event: { value: string | null }) {
    this.isNewMode.set(false);
    this.store.selectSchedule(event.value);
  }

  onNewClick() {
    this.store.selectSchedule(null);
    this.isNewMode.set(true);
  }

  onDeleteClick() {
    const id = this.store.selectedScheduleId();
    if (id && confirm(`Are you sure you want to delete schedule "${id}"?`)) {
      this.store.deleteSchedule(id);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please correct the errors before saving.');
      return;
    }

    const payload = this.mapFormToApi();
    console.log('Submitting Payload:', payload);

    if (this.isNewMode()) {
      this.store.addSchedule(payload);
    } else {
      this.store.updateSchedule(payload as Schedule);
    }
    this.isNewMode.set(false);
  }
}
