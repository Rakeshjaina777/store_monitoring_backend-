import { DateTime } from 'luxon';

export function convertLocalToUTC(
  localTime: string,
  dayOfWeek: number,
  timezone: string,
  referenceDate: Date,
): Date {
  const ref = DateTime.fromJSDate(referenceDate).setZone(timezone);
  const startOfWeek = ref.startOf('week').plus({ days: dayOfWeek });

  const [hour, minute] = localTime.split(':').map(Number);
  const localDate = startOfWeek.set({ hour, minute });

  return localDate.toUTC().toJSDate();
}

export function nowUTC(): Date {
  return DateTime.utc().toJSDate();
}

export function utcToLocal(date: Date, timezone: string): string {
  return DateTime.fromJSDate(date).setZone(timezone).toFormat('HH:mm');
}
