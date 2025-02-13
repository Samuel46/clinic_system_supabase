/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,id]` on the table `DayOff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,id]` on the table `WorkDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DayOff_scheduleId_date_key";

-- DropIndex
DROP INDEX "WorkDay_scheduleId_day_key";

-- CreateIndex
CREATE UNIQUE INDEX "DayOff_scheduleId_id_key" ON "DayOff"("scheduleId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkDay_scheduleId_id_key" ON "WorkDay"("scheduleId", "id");
