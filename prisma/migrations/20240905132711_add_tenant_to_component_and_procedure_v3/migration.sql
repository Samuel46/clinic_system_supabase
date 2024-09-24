/*
  Warnings:

  - Added the required column `procedureId` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "procedureId" UUID NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Procedure" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureStep" (
    "id" UUID NOT NULL,
    "procedureId" UUID NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER,
    "role" TEXT,

    CONSTRAINT "ProcedureStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureEquipment" (
    "id" UUID NOT NULL,
    "procedureId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProcedureEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentComponent" (
    "id" UUID NOT NULL,
    "treatmentId" UUID NOT NULL,
    "componentId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "TreatmentComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_name_index" ON "Procedure"("tenantId", "name");

-- CreateIndex
CREATE INDEX "tenant_created_updated_index_procedure" ON "Procedure"("tenantId", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureStep_procedureId_stepNumber_key" ON "ProcedureStep"("procedureId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureEquipment_procedureId_equipmentId_key" ON "ProcedureEquipment"("procedureId", "equipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE INDEX "tenant_name_index_component" ON "Component"("tenantId", "name");

-- CreateIndex
CREATE INDEX "tenant_created_updated_index_component" ON "Component"("tenantId", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentComponent_treatmentId_componentId_key" ON "TreatmentComponent"("treatmentId", "componentId");

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureStep" ADD CONSTRAINT "ProcedureStep_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureEquipment" ADD CONSTRAINT "ProcedureEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureEquipment" ADD CONSTRAINT "ProcedureEquipment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentComponent" ADD CONSTRAINT "TreatmentComponent_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentComponent" ADD CONSTRAINT "TreatmentComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
