/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_email_key";

-- DropIndex
DROP INDEX "tenant_patient_email_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Patient_tenantId_email_key" ON "Patient"("tenantId", "email");
