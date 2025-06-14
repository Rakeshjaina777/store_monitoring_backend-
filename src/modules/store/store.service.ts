import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { convertLocalToUTC } from 'src/common/utils/timezone.util';
import { CreateStoreDto } from 'src/common/dto/store.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createStore(data: CreateStoreDto) {
    return this.prisma.store.create({ data });
  }

  async getStoreById(storeId: string) {
    return this.prisma.store.findUnique({ where: { id: storeId } });
  }

  async getStoreUptimeLastHour(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { businessHours: true },
    });

    if (!store) {
      return { uptimeMinutes: 0, downtimeMinutes: 60 };
    }

    const now = DateTime.utc();
    const oneHourAgo = now.minus({ hours: 1 });

    const dayOfWeek = now.setZone(store.timezone).weekday % 7;

    const todayHours = store.businessHours.find(
      (hour) => hour.dayOfWeek === dayOfWeek,
    );

    if (!todayHours) return { uptimeMinutes: 0, downtimeMinutes: 60 };

    const startUTC = convertLocalToUTC(
      todayHours.startTime,
      dayOfWeek,
      store.timezone,
      new Date(),
    );

    const endUTC = convertLocalToUTC(
      todayHours.endTime,
      dayOfWeek,
      store.timezone,
      new Date(),
    );

    const queryStart = oneHourAgo > startUTC ? oneHourAgo : startUTC;
    const queryEnd = now < endUTC ? now : endUTC;

    if (queryStart > queryEnd) {
      return { uptimeMinutes: 0, downtimeMinutes: 60 };
    }

    const statuses = await this.prisma.storeStatus.findMany({
      where: {
        storeId,
        timestamp: {
          gte: queryStart.toJSDate(),
          lte: queryEnd.toJSDate(),
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    return this.estimateDurations(statuses, queryStart, queryEnd);
  }

  estimateDurations(statuses, start, end) {
    let activeMinutes = 0;
    let lastTimestamp = start;
    let lastStatus = 'inactive';

    for (const status of statuses) {
      const duration = DateTime.fromJSDate(status.timestamp).diff(
        lastTimestamp,
        'minutes',
      ).minutes;

      if (lastStatus === 'active') {
        activeMinutes += duration;
      }

      lastStatus = status.status;
      lastTimestamp = DateTime.fromJSDate(status.timestamp);
    }

    const finalDuration = end.diff(lastTimestamp, 'minutes').minutes;
    if (lastStatus === 'active') {
      activeMinutes += finalDuration;
    }

    return {
      uptimeMinutes: Math.round(activeMinutes),
      downtimeMinutes: Math.round(60 - activeMinutes),
    };
  }
}
