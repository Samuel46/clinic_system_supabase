/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DayOff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DayOff_name_key" ON "DayOff"("name");
