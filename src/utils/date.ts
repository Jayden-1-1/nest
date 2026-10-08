/**
 * Robust local date calculations for NEST
 * Prevents UTC timezone drift caused by toISOString() in negative or positive offsets.
 */

export const formatLocalDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateStr: string): Date => {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day);
};

export const getDaysInMonth = (year: number, month: number): number => {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  // Day 0 of next month is the last day of this month
  return new Date(year, month + 1, 0).getDate();
};

export interface CalendarDayInfo {
  dateStr: string;
  dayNumber: number;
  year: number;
  month: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
}

/**
 * Builds a complete 35 or 42 day calendar matrix starting on Monday.
 * Accurately fills preceding days from previous month and trailing days from next month.
 */
export const getCalendarMatrix = (year: number, month: number): CalendarDayInfo[] => {
  const todayStr = formatLocalDate(new Date());
  
  // 1st day of month
  const firstDay = new Date(year, month, 1);
  // Sunday is 0 in JS. We want Monday = 0, Sunday = 6
  const firstDayWeekday = (firstDay.getDay() + 6) % 7;

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const cells: CalendarDayInfo[] = [];

  // Preceding days from previous month
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber,
      year: prevYear,
      month: prevMonthIndex,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false,
      isToday: dateStr === todayStr,
      dayOfWeek: cells.length % 7,
    });
  }

  // Current month days
  for (let dayNumber = 1; dayNumber <= daysInCurrentMonth; dayNumber++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber,
      year,
      month,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false,
      isToday: dateStr === todayStr,
      dayOfWeek: cells.length % 7,
    });
  }

  // Trailing days from next month to complete the row (multiples of 7, up to 35 or 42)
  const totalSlotsNeeded = cells.length <= 35 ? 35 : 42;
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDayNum = 1;

  while (cells.length < totalSlotsNeeded) {
    const dateStr = `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: nextDayNum,
      year: nextYear,
      month: nextMonthIndex,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true,
      isToday: dateStr === todayStr,
      dayOfWeek: cells.length % 7,
    });
    nextDayNum++;
  }

  return cells;
};
