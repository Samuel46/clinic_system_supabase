/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Treatment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_name_key" ON "Treatment"("name");
