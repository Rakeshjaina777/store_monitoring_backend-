import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { DateTime } from "luxon";




export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreUptimeLastHour(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { businessHours: true },
    });

    if (!store) {
      throw new Error(`Store with id ${storeId} not found`);
    }

    const now = DateTime.utc();
    
    const oneHourAgo = now.minus({ hours: 1 });
    
    const dayOfWeek = now.setZone(store.timezone).weekday % 7;

  }

}
