/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `DayOff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day]` on the table `WorkDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DayOff_scheduleId_date_key";

-- DropIndex
DROP INDEX "WorkDay_scheduleId_day_key";

-- CreateIndex
CREATE UNIQUE INDEX "DayOff_date_key" ON "DayOff"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WorkDay_day_key" ON "WorkDay"("day");
