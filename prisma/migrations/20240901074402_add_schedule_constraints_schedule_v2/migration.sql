/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,date]` on the table `DayOff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,day]` on the table `WorkDay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DayOff_scheduleId_date_key" ON "DayOff"("scheduleId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WorkDay_scheduleId_day_key" ON "WorkDay"("scheduleId", "day");
