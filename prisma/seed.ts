import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores: any[] = [];

  for (let i = 1; i <= 5; i++) {
    const store = await prisma.store.create({
      data: {
        name: `Loop Pizza ${i}`,
        timezone: 'America/New_York',
        businessHours: {
          create: Array.from({ length: 5 }, (_, day) => ({
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '21:00',
          })),
        },
        statuses: {
          create: [
            {
              status: 'active',
              timestamp: new Date(`2025-06-13T0${i}:00:00Z`),
            },
            {
              status: 'inactive',
              timestamp: new Date(`2025-06-13T1${i}:00:00Z`),
            },
            {
              status: 'active',
              timestamp: new Date(`2025-06-14T0${i}:00:00Z`),
            },
            {
              status: 'inactive',
              timestamp: new Date(`2025-06-14T1${i}:00:00Z`),
            },
            {
              status: 'active',
              timestamp: new Date(`2025-06-15T0${i}:00:00Z`),
            },
          ],
        },
      },
    });

    stores.push(store);
  }

  console.log(`✅ Seeded ${stores.length} stores`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    prisma.$disconnect();
    process.exit(1);
  });
