-- CreateEnum
CREATE TYPE "StoreActivityStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreStatus" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "status" "StoreActivityStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreBusinessHour" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "StoreBusinessHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreStatus_storeId_idx" ON "StoreStatus"("storeId");

-- CreateIndex
CREATE INDEX "StoreStatus_timestamp_idx" ON "StoreStatus"("timestamp");

-- CreateIndex
CREATE INDEX "StoreBusinessHour_storeId_dayOfWeek_idx" ON "StoreBusinessHour"("storeId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "StoreStatus" ADD CONSTRAINT "StoreStatus_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreBusinessHour" ADD CONSTRAINT "StoreBusinessHour_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
