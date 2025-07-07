export interface ScheduleSelection {
  duration?: {
    days: number;
    hours: number;
    minutes: number;
  };
  selectedTimes?: string[];
  selectedWeekDays?: string[];
}
