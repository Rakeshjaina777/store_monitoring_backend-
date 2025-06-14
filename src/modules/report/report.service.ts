import { Injectable } from '@nestjs/common';
import { ReportStatus } from 'src/common/enum/report-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { getUtcBusinessWindow } from 'src/common/utils/business-hour.util';

@Injectable()
export class ReportService {
  private reports = new Map<string, { status: ReportStatus; csv?: string }>();
    prisma: any;

  triggerReport(): string {
    const reportId = uuidv4();
    this.reports.set(reportId, { status: ReportStatus.RUNNING });

    // Simulate async processing (replace with queue/job later)
    setTimeout(async () => {
      const csv = await this.generateCSV(); // Simulated CSV output
      this.reports.set(reportId, {
        status: ReportStatus.COMPLETE,
        csv,
      });
    }, 3000); // simulate 3s generation

    return reportId;
  }

  getReport(reportId: string) {
    const report = this.reports.get(reportId);
    if (!report) return { status: 'NOT_FOUND' };
    return report;
  }

  async generateCSV(): Promise<string> {
    const now = DateTime.utc();
    const oneHourAgo = now.minus({ hours: 1 });
    const oneDayAgo = now.minus({ days: 1 });
    const oneWeekAgo = now.minus({ weeks: 1 });

    const stores = await this.prisma.store.findMany({
      include: {
        statuses: true,
        businessHours: true,
      },
    });

    const headers = [
      'store_id',
      'uptime_last_hour(in minutes)',
      'uptime_last_day(in hours)',
      'uptime_last_week(in hours)',
      'downtime_last_hour(in minutes)',
      'downtime_last_day(in hours)',
      'downtime_last_week(in hours)',
    ];

    const rows: string[] = [headers.join(',')];

    for (const store of stores) {
      const tz = store.timezone || 'America/Chicago';

      const [hourData, dayData, weekData] = await Promise.all([
        this.computeDurations(store, oneHourAgo, now, tz),
        this.computeDurations(store, oneDayAgo, now, tz),
        this.computeDurations(store, oneWeekAgo, now, tz),
      ]);

      rows.push(
        [
          store.id,
          hourData.uptime.toFixed(2),
          dayData.uptime.toFixed(2),
          weekData.uptime.toFixed(2),
          hourData.downtime.toFixed(2),
          dayData.downtime.toFixed(2),
          weekData.downtime.toFixed(2),
        ].join(','),
      );
    }

    return rows.join('\n');
  }
  private async computeDurations(
    store: any,
    start: DateTime,
    end: DateTime,
    timezone: string,
  ): Promise<{ uptime: number; downtime: number }> {
    const dayMap = new Map<number, any[]>();
    store.businessHours.forEach((bh) => {
      if (!dayMap.has(bh.dayOfWeek)) {
        dayMap.set(bh.dayOfWeek, []);
      }
      dayMap.get(bh.dayOfWeek)!.push(bh);
    });

    let uptime = 0;
    let downtime = 0;

    for (
      let cursor = start.startOf('day');
      cursor < end;
      cursor = cursor.plus({ days: 1 })
    ) {
      const dow = cursor.setZone(timezone).weekday % 7;
      const bHours = dayMap.get(dow) || [
        {
          startTime: '00:00',
          endTime: '23:59',
        },
      ];

      for (const bh of bHours) {
        const { startUtc, endUtc } = getUtcBusinessWindow(bh, timezone, cursor);
        const from = DateTime.fromJSDate(startUtc);
        const to = DateTime.fromJSDate(endUtc);

        const boundedStart = from > start ? from : start;
        const boundedEnd = to < end ? to : end;

        if (boundedStart >= boundedEnd) continue;

        const statuses = await this.prisma.storeStatus.findMany({
          where: {
            storeId: store.id,
            timestamp: {
              gte: boundedStart.toJSDate(),
              lte: boundedEnd.toJSDate(),
            },
          },
          orderBy: { timestamp: 'asc' },
        });

        const result = this.interpolateUptime(
          statuses,
          boundedStart,
          boundedEnd,
        );
        uptime += result.uptime;
        downtime += result.downtime;
      }
    }

    return {
      uptime: uptime / 60,
      downtime: downtime / 60,
    };
  }
  private interpolateUptime(
    statuses: any[],
    from: DateTime,
    to: DateTime,
  ): { uptime: number; downtime: number } {
    let uptime = 0;
    let downtime = 0;
    let lastStatus = 'inactive';
    let lastTime = from;

    for (const s of statuses) {
      const current = DateTime.fromJSDate(s.timestamp);
      const duration = current.diff(lastTime, 'minutes').minutes;

      if (lastStatus === 'active') uptime += duration;
      else downtime += duration;

      lastStatus = s.status;
      lastTime = current;
    }

    const finalDuration = to.diff(lastTime, 'minutes').minutes;
    if (lastStatus === 'active') uptime += finalDuration;
    else downtime += finalDuration;

    return { uptime, downtime };
  }
}



