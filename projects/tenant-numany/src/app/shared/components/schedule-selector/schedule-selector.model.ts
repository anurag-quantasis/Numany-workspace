export interface ScheduleSelection {
  duration?: {
    days: number;
    hours: number;
    minutes: number;
  };
  selectedTimes?: string[];
  selectedWeekDays?: string[];
  timeInterval?: {
    int_day: number;
    int_val: number;
  };

  adminTimes?: string[];

  weekDays?: {
    [key: string]: boolean;
  };
}
