import { DateTime } from 'luxon';
import { StoreBusinessHour } from '@prisma/client';

export function getUtcBusinessWindow(
  businessHour: StoreBusinessHour,
  timezone: string,
  baseDate: DateTime,
): { startUtc: Date; endUtc: Date } {
  const [startHour, startMin] = businessHour.startTime.split(':').map(Number);
  const [endHour, endMin] = businessHour.endTime.split(':').map(Number);

  const localStart = baseDate
    .setZone(timezone)
    .set({ hour: startHour, minute: startMin });

  const localEnd = baseDate
    .setZone(timezone)
    .set({ hour: endHour, minute: endMin });

  return {
    startUtc: localStart.toUTC().toJSDate(),
    endUtc: localEnd.toUTC().toJSDate(),
  };
}
